import { Avatar, Box, Card, CardContent, Typography, TextField, Button, Select, MenuItem, Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { remult } from "../common";
import { Contact } from "../Contacts/Contact.entity";
import { ContactNote } from "./ContactNote.entity";
import { ContactAside } from "./ContactAside"
import { Logo } from "../Companies/Logo";
import { StatusIndicator } from "./StatusIndicator";
import { DateTimePicker } from "@mui/lab";
import { Status } from "./Status";

export const ContactShow: React.FC<{}> = () => {
    let params = useParams();
    const [contact, setContact] = useState<Contact>();
    const [notes, setNotes] = useState<ContactNote[]>([]);

    const [loading, setLoading] = useState(true);

    const [newNote, setNewNote] = useState(new ContactNote())

    const submitNewNote = async () => {
        const submittedNote = await remult.repo(ContactNote).insert({ ...newNote, contact });
        setNotes([submittedNote, ...notes]);
        setNewNote(new ContactNote())
    }

    useEffect(() => {
        (async () => {
            const contact = await remult.repo(Contact).findId(params.id!);
            setContact(contact);
            if (contact) {
                setNotes(await remult.repo(ContactNote).find({ where: { contact }, orderBy: { createdAt: "desc" } }));
            }
            setLoading(false)
        })();
    }, [params.id]);

    if (loading)
        return <span>Loading</span>;
    if (!contact)
        return <span>not found</span>;

    return <Box mt={2} display="flex">
        <Box flex="1">
            <Card>
                <CardContent>
                    <Box display="flex">
                        <Avatar src={contact.avatar} />
                        <Box ml={2} flex="1">
                            <Typography variant="h4">
                                {contact.firstName} {contact.lastName}
                            </Typography>
                            <Typography variant="body1">
                                {contact.title} at {' '}
                                <Link component={RouterLink} to={`/companies/${contact.company?.id}`}>
                                    {contact.company?.name}
                                </Link>
                            </Typography>
                        </Box>
                        <Box>
                            <Logo url={contact.company!.logo} title={contact.company!.name} sizeInPixels={20} />
                        </Box>
                    </Box>

                    <Box mt={2}>
                        <TextField
                            label="Add a note"
                            size="small"
                            fullWidth
                            multiline
                            value={newNote.text}
                            onChange={(e: any) => setNewNote({ ...newNote, text: e.target.value })}
                            rows={3}
                        />

                        <Box mt={1} display="flex">
                            <Box component="span" flex="1">
                                <Select
                                    labelId="status-label"
                                    label="Status"
                                    value={newNote.status?.id}
                                    onChange={e => setNewNote({ ...newNote, status: Status.helper.byId(e.target.value)! })}
                                    disabled={!newNote.text || loading}
                                >
                                    {Status.helper.getOptions().map(s => (<MenuItem key={s.id} value={s.id}>{s.caption}</MenuItem>))}
                                </Select>

                                <DateTimePicker
                                    value={newNote.createdAt}
                                    onChange={d => setNewNote({ ...newNote, createdAt: d || new Date() })}
                                    renderInput={p => <TextField {...p} />}
                                    disabled={!newNote.text || loading}
                                />
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!newNote.text || loading}
                                onClick={() => submitNewNote()}
                            >
                                Add this note
                            </Button>
                        </Box>
                    </Box>

                    {notes.map((note) => (<Box key={note.id} mt={2}>
                        {note.accountManager?.firstName}
                        added a note on {' '}
                        {note.createdAt.toLocaleString()}{' '}
                        <StatusIndicator status={note.status} />
                        <Card>
                            <CardContent>
                                <Typography variant="body1">
                                    {note.text}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                    ))}
                </CardContent>
            </Card>
        </Box>
        <ContactAside contact={contact} setContact={setContact}></ContactAside>
    </Box >
}
