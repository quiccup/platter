interface SectionEditorProps {
  section: string
  data: any
  onChange: (newData: any) => void
}

export function SectionEditor({ section, data, onChange }: SectionEditorProps) {
  switch (section) {
    case 'hero':
      return (
        <div className="space-y-4">
          <input
            type="text"
            value={data.heading}
            onChange={(e) => onChange({ ...data, heading: e.target.value })}
            placeholder="Heading"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            placeholder="Description"
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
      )
    // Add other section editors...
  }
} 