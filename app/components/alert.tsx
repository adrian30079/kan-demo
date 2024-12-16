'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import CreateNewAlert from './alert-create-new-alert'
import alertData from './data-alert.json'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type Alert = {
  status: boolean
  name: string
  type: string
  channels: string[]
  timeTriggered: number
  topic: string
}

export function AlertComponent() {
  const [alerts, setAlerts] = useState<Alert[]>(alertData)
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  const [editingAlert, setEditingAlert] = useState<Alert | undefined>(undefined)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; alert: Alert | null }>({
    open: false,
    alert: null
  })

  const renderChannelIcon = (channel: string) => {
    const iconClasses = "w-5 h-5"
    const iconMap: {[key: string]: string} = {
      facebook: "/img/media/ic-mediatype-facebook.png",
      instagram: "/img/media/ic-mediatype-instagram.png",
      X: "/img/media/ic-mediatype-X.png",
      LIHKG: "/img/media/ic-mediatype-lihkg.png",
    }

    return <img src={iconMap[channel]} alt={channel} className={iconClasses} />
  }

  const handleSaveAlert = (newAlert: Alert) => {
    setAlerts(prev => [...prev, newAlert])
    setShowCreateAlert(false)
  }

  const handleEditAlert = (alert: Alert) => {
    setShowCreateAlert(true)
    setEditingAlert(alert)
  }

  const handleDeleteAlert = (alert: Alert) => {
    setAlerts(prev => prev.filter(a => a !== alert))
    setDeleteDialog({ open: false, alert: null })
  }

  const handleStatusChange = (alert: Alert) => {
    setAlerts(prev => prev.map(a => 
      a === alert ? { ...a, status: !a.status } : a
    ))
  }

  if (showCreateAlert) {
    return (
      <CreateNewAlert 
        onBack={() => {
          setShowCreateAlert(false)
          setEditingAlert(undefined)
        }}
        onSave={handleSaveAlert}
        editingAlert={editingAlert}
      />
    )
  }

  return (
    <div className="space-y-4 px-24 pt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#00857C]">Alert Dashboard</h1>
        <Button 
          variant="default" 
          className="bg-[#00857C] hover:bg-[#006d65] text-white"
          onClick={() => setShowCreateAlert(true)}
        >
          + Create Alert
        </Button>
      </div>

      <p className="text-md text-muted-foreground mb-4">
        Monitor and manage your alerts for real-time notifications about important changes in your data.
      </p>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-[96px_1.5fr_1fr_1fr_1fr] gap-4 p-4 border-b bg-[#00857C] text-white font-bold">
          <div>Status</div>
          <div>Alert Name</div>
          <div>Alert Type</div>
          <div>Channels</div>
          <div>Time Triggered</div>
        </div>

        {alerts.map((alert, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-[96px_1.5fr_1fr_1fr_1fr] gap-4 p-4 border-b items-center ${!alert.status ? 'opacity-50 bg-gray-300' : ''}`}
          >
            <div>
              <Switch
                checked={alert.status}
                onCheckedChange={() => handleStatusChange(alert)}
                className={`data-[state=checked]:bg-[#00857C] data-[state=unchecked]:bg-gray-200`}
              />
            </div>
            <div>{alert.name}</div>
            <div>
              <span className="px-3 py-1 bg-[#EDFBF9] text-[#32504C] rounded-full text-sm">
                {alert.type}
              </span>
            </div>
            <div className="flex gap-1">
              {alert.channels.map((channel, idx) => (
                <div key={idx}>
                  {renderChannelIcon(channel)}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span>{alert.timeTriggered}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-700"
                  onClick={() => handleEditAlert(alert)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-700"
                  onClick={() => setDeleteDialog({ open: true, alert })}
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ open, alert: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Alert</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.alert?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, alert: null })}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteDialog.alert && handleDeleteAlert(deleteDialog.alert)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}