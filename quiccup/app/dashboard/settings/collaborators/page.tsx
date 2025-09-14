'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus, Mail, User } from 'lucide-react'

interface Collaborator {
  id: string
  email: string
  permission: 'view' | 'edit'
}

interface CollaboratorCardProps {
  collaborator: Collaborator
  onRemove: (id: string) => void
  onPermissionChange: (id: string, permission: 'view' | 'edit') => void
  onSendTestEmail: (email: string, permission: 'view' | 'edit') => void
}

function CollaboratorCard({ collaborator, onRemove, onPermissionChange, onSendTestEmail }: CollaboratorCardProps) {
  return (
    <div className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{collaborator.email}</p>
          <p className="text-sm text-gray-500">
            {collaborator.permission === 'edit' ? 'Can edit menu items' : 'Can view menu items'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Permission Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Menu Permissions
          </label>
          <Select
            value={collaborator.permission}
            onValueChange={(value: 'view' | 'edit') => 
              onPermissionChange(collaborator.id, value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="view">View Only</SelectItem>
              <SelectItem value="edit">Can Edit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Test Email Button */}
        <div className="flex flex-col gap-1">
          <div className="h-4"></div> {/* Spacer to align with dropdown */}
          <Button
            onClick={() => onSendTestEmail(collaborator.email, collaborator.permission)}
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            📧 Test
          </Button>
        </div>

        {/* Remove Button */}
        <div className="flex flex-col gap-1">
          <div className="h-4"></div> {/* Spacer to align with dropdown */}
          <Button
            onClick={() => onRemove(collaborator.id)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CollaboratorsPage() {
  const [emailInput, setEmailInput] = useState('')
  const [selectedPermission, setSelectedPermission] = useState<'view' | 'edit'>('view')
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    // Demo data
    { id: '1', email: 'john@example.com', permission: 'edit' },
    { id: '2', email: 'sarah@example.com', permission: 'view' },
  ])

  const sendInvitationEmail = async (email: string, permission: 'view' | 'edit') => {
    try {
      const response = await fetch('/api/collaborators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          restaurantName: 'Your Restaurant Name',
          permission: permission,
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`✅ Invitation sent to ${email}!`)
      } else if (result.isTestMode) {
        alert(`⚠️ Test Mode: ${result.error}\n\nFor now, you can only send test emails to ${result.allowedEmail}. To send to other recipients, verify a domain at resend.com/domains.`)
      } else {
        alert(`❌ Failed to send invitation: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Error sending invitation: ${error}`)
    }
  }

  const handleAddCollaborator = async () => {
    if (!emailInput.trim()) return

    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      email: emailInput.trim(),
      permission: selectedPermission
    }

    setCollaborators(prev => [...prev, newCollaborator])
    
    await sendInvitationEmail(emailInput.trim(), selectedPermission)
    
    setEmailInput('')
    setSelectedPermission('view') // Reset to default
  }

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(prev => prev.filter(collab => collab.id !== id))
  }

  const handlePermissionChange = (id: string, permission: 'view' | 'edit') => {
    setCollaborators(prev => 
      prev.map(collab => 
        collab.id === id ? { ...collab, permission } : collab
      )
    )
  }

  // Test email function for existing collaborators
  const sendTestEmail = async (email: string, permission: 'view' | 'edit') => {
    await sendInvitationEmail(email, permission)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Collaborators</h2>
          <p className="text-gray-600 mt-1">Manage who can access and edit your restaurant website</p>
        </div>
      </div>

      {/* Add Collaborator Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Collaborator</h3>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter collaborator's email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddCollaborator()}
            />
          </div>
          <div className="w-32">
            <Select
              value={selectedPermission}
              onValueChange={(value: 'view' | 'edit') => setSelectedPermission(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="edit">Can Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddCollaborator}
            disabled={!emailInput.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add & Send Invite
          </Button>
        </div>
      </div>

      {/* Collaborators List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Current Collaborators</h3>
          <p className="text-gray-600 text-sm mt-1">
            {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}
          </p>
        </div>

        {collaborators.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No collaborators added yet</p>
            <p className="text-sm">Add someone to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {collaborators.map((collaborator) => (
              <CollaboratorCard
                key={collaborator.id}
                collaborator={collaborator}
                onRemove={handleRemoveCollaborator}
                onPermissionChange={handlePermissionChange}
                onSendTestEmail={sendTestEmail}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How Collaborators Work</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>View Only:</strong> Collaborators can see menu items but cannot make changes</li>
          <li>• <strong>Can Edit:</strong> Collaborators can add, edit, and remove menu items</li>
          <li>• All collaborators will receive an email invitation to join your restaurant</li>
          <li>• You can change permissions or remove collaborators at any time</li>
        </ul>
      </div>
    </div>
  )
}