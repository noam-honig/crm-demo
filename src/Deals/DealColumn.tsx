import { Typography } from '@mui/material'
import { Droppable } from 'react-beautiful-dnd'
import { Deal } from './Deal.entity'
import { DealCard } from './DealCard'
import { InstanceTypeWithRelations } from '../dev-remult/relations'

export const DealColumn = ({
  stage,
  deals
}: {
  stage: string
  deals: InstanceTypeWithRelations<
    typeof Deal,
    {
      company2: true
    }
  >[]
}) => {
  return (
    <div>
      <Typography align="center" variant="subtitle1">
        {stage}
      </Typography>
      <Droppable droppableId={stage}>
        {(droppableProvided, snapshot) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {deals.map((deal, index) => (
              <DealCard key={deal.id} index={index} deal={deal} />
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
