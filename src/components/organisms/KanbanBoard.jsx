import { useState, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { dealService, contactService, companyService } from '@/services'

const DEAL_STAGES = [
  { id: 'Lead', label: 'Lead', color: 'lead' },
  { id: 'Qualified', label: 'Qualified', color: 'qualified' },
  { id: 'Proposal', label: 'Proposal', color: 'proposal' },
  { id: 'Negotiation', label: 'Negotiation', color: 'negotiation' },
  { id: 'Closed Won', label: 'Closed Won', color: 'won' },
  { id: 'Closed Lost', label: 'Closed Lost', color: 'lost' }
]

export default function KanbanBoard({ deals = [], contacts = [], companies = [], onUpdate }) {
  const [isDragging, setIsDragging] = useState(false)

  const getContactName = useCallback((contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact'
  }, [contacts])

  const getCompanyName = useCallback((companyId) => {
    const company = companies.find(c => c.Id === companyId)
    return company ? company.name : 'Unknown Company'
  }, [companies])

  const getDealsByStage = useCallback((stage) => {
    return deals.filter(deal => deal.stage === stage)
  }, [deals])

  const handleDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback(async (result) => {
    setIsDragging(false)
    
    if (!result.destination) return

    const { draggableId, destination } = result
    const dealId = parseInt(draggableId, 10)
    const newStage = destination.droppableId

    try {
      await dealService.update(dealId, { stage: newStage })
      onUpdate?.()
      toast.success('Deal stage updated successfully')
    } catch (error) {
      toast.error('Failed to update deal stage')
    }
  }, [onUpdate])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {DEAL_STAGES.map((stage) => {
          const stageDeals = getDealsByStage(stage.id)
          const stageValue = stageDeals.reduce((sum, deal) => sum + deal.amount, 0)

          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <div className="bg-surface-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-surface-900">{stage.label}</h3>
                    <p className="text-sm text-surface-600">
                      {stageDeals.length} deals • {formatCurrency(stageValue)}
                    </p>
                  </div>
                  <Badge variant={stage.color} size="sm">
                    {stageDeals.length}
                  </Badge>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] transition-colors duration-200 ${
                        snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg p-2' : ''
                      }`}
                    >
                      {stageDeals.map((deal, index) => (
                        <Draggable
                          key={deal.Id}
                          draggableId={deal.Id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`transition-all duration-200 ${
                                snapshot.isDragging ? 'opacity-80 scale-105 rotate-2' : ''
                              }`}
                            >
                              <Card hover className="p-4 cursor-move">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-surface-900 break-words">
                                    {deal.name}
                                  </h4>
                                  <ApperIcon name="GripVertical" className="w-4 h-4 text-surface-400 flex-shrink-0 ml-2" />
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-primary">
                                      {formatCurrency(deal.amount)}
                                    </span>
                                    <Badge variant="default" size="sm">
                                      {new Date(deal.closeDate).toLocaleDateString()}
                                    </Badge>
                                  </div>
                                  
                                  <div className="text-sm text-surface-600">
                                    <div className="flex items-center space-x-1 mb-1">
                                      <ApperIcon name="User" className="w-3 h-3" />
                                      <span>{getContactName(deal.contactId)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <ApperIcon name="Building2" className="w-3 h-3" />
                                      <span>{getCompanyName(deal.companyId)}</span>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}