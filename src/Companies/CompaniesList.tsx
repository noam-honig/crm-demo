import { Button, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { remult } from "../common"
import { Company } from "./Company.entity"
import AddIcon from '@mui/icons-material/Add';
import { CompanyEdit } from "./CompanyEdit";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSearchParams } from "react-router-dom";
import { CompanySize } from "./CompanySize";
import CancelIcon from '@mui/icons-material/Cancel';
import { sectors } from "./Sectors";


const amRepo = remult.repo(Company);

export const CompaniesList: React.FC<{}> = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const search = {
        search: searchParams.get("search") || '',
        size: searchParams.get("size") || '',
        sector: searchParams.get("sector") || ''
    };

    const [companys, setCompanys] = useState<Company[]>([]);
    const loadCompanys = useCallback(() => amRepo.find({
        where: {
            name: { $contains: search.search },
            size: search.size ? CompanySize.helper.byId(search.size) : undefined,
            sector: search.sector ? search.sector : undefined
        }, limit: 5
    }).then(setCompanys), [search.search, search.size, search.sector]);
    useEffect(() => {
        loadCompanys()
    }, [loadCompanys]);
    const [newCompany, setNewCompany] = useState<Company>();
    const [editCompany, setEditCompany] = useState<Company>();
    const deleteCompany = async (deletedCompany: Company) => {
        await amRepo.delete(deletedCompany);
        setCompanys(companys.filter(company => deletedCompany.id != company.id));
    }
    const editCompanySaved = (editCompany: Company) =>
        setCompanys(companys.map(company => company.id === editCompany.id ? editCompany : company));

    return <Grid container spacing={2}>
        <Grid item xs={2}>
            <TextField label="Search" variant="filled"
                value={search.search}
                onChange={e =>
                    setSearchParams({ ...search, search: e.target.value })
                } />
            <List dense={true}>
                <ListItem>
                    <ListItemText>SIZE</ListItemText>
                </ListItem>
                {CompanySize.helper.getOptions().map((s: CompanySize) => (<ListItem
                    key={s.id}

                    secondaryAction={s.id.toString() == search.size &&
                        <IconButton edge="end" aria-label="cancel" onClick={() => {
                            setSearchParams({ ...search, size: '' })
                        }}>
                            <CancelIcon />
                        </IconButton>
                    }>
                    <ListItemButton onClick={() => {
                        setSearchParams({ ...search, size: s.id.toString() });
                    }}>
                        <ListItemText
                            primary={s.caption}
                        />
                    </ListItemButton>
                </ListItem>))}
                <ListItem>
                    <ListItemText>SECTOR</ListItemText>
                </ListItem>
                {sectors.map((s) => (<ListItem
                    key={s}

                    secondaryAction={s.toString() == search.sector &&
                        <IconButton edge="end" aria-label="cancel" onClick={() => {
                            setSearchParams({ ...search, sector: '' })
                        }}>
                            <CancelIcon />
                        </IconButton>
                    }>
                    <ListItemButton onClick={() => {
                        setSearchParams({ ...search, sector: s });
                    }}>
                        <ListItemText

                            primary={s}

                        />
                    </ListItemButton>
                </ListItem>))}
            </List>
        </Grid>
        <Grid item xs={10}>
            <Button
                variant="contained"
                onClick={() => setNewCompany(amRepo.create())}
                startIcon={<AddIcon />}>
                Add Company
            </Button>
            <List>
                {companys.map(am => (
                    <ListItem disablePadding key={am.id} secondaryAction={
                        <Stack direction="row" spacing={2}>
                            <IconButton edge="end" aria-label="edit"
                                onClick={() => deleteCompany(am)}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="edit"
                                onClick={() => setEditCompany(am)}>
                                <EditIcon />
                            </IconButton>
                        </Stack>
                    }>
                        <ListItemButton>
                            <ListItemText primary={am.name} />
                        </ListItemButton>
                    </ListItem>
                ))}

            </List>
            {
                editCompany && <CompanyEdit
                    company={editCompany}
                    create={false}
                    onClose={() => setEditCompany(undefined)}
                    onSaved={(company) => {
                        editCompanySaved(company)
                    }} />
            }
            {
                newCompany && <CompanyEdit
                    company={newCompany}
                    create={true}
                    onClose={() => setNewCompany(undefined)}
                    onSaved={() => {
                        loadCompanys()
                    }} />
            }
        </Grid>
    </Grid >
}