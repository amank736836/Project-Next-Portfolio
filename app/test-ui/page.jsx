import { Button, Input, Card, Badge } from '@/components/ui';

export default function TestUI() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">UI Component Test</h1>

      <div className="grid gap-6 mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>

          <Button variant="primary" size="sm">Small Primary</Button>
          <Button variant="primary" size="lg">Large Primary</Button>
          <Button variant="primary" size="icon">
            <span>Icon</span>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Default Input" />
          <Input placeholder="Success Input" variant="success" />
          <Input placeholder="Error Input" variant="error" />
          <Input placeholder="Small Input" size="sm" />
          <Input placeholder="Large Input" size="lg" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Default Card</h3>
            <p>This is a sample card content.</p>
          </Card>

          <Card variant="elevated" className="p-6">
            <h3 className="text-xl font-bold mb-4">Elevated Card</h3>
            <p>This card has elevation.</p>
          </Card>

          <Card variant="subtle" className="p-6">
            <h3 className="text-xl font-bold mb-4">Subtle Card</h3>
            <p>This card has subtle styling.</p>
          </Card>
        </div>

        <div className="grid gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      </div>
    </div>
  );
}