import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

export function SettingsView() {
  return (
    <div className='space-y-6'>
      <h2 className='text-3xl font-bold tracking-tight'>Settings</h2>

      <Tabs defaultValue='general' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 lg:w-[400px]'>
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='site-name'>Site Name</Label>
                <Input id='site-name' defaultValue='Admin Dashboard' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='site-description'>Site Description</Label>
                <Textarea
                  id='site-description'
                  defaultValue='A comprehensive admin dashboard for managing your application.'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='timezone'>Timezone</Label>
                <select
                  id='timezone'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  <option value='utc'>UTC</option>
                  <option value='est'>Eastern Standard Time (EST)</option>
                  <option value='cst'>Central Standard Time (CST)</option>
                  <option value='mst'>Mountain Standard Time (MST)</option>
                  <option value='pst'>Pacific Standard Time (PST)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='dark-mode'>Dark Mode</Label>
                  <p className='text-sm text-muted-foreground'>
                    Enable dark mode for your dashboard
                  </p>
                </div>
                <Switch id='dark-mode' />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label htmlFor='compact-mode'>Compact Mode</Label>
                  <p className='text-sm text-muted-foreground'>
                    Use compact view for tables and lists
                  </p>
                </div>
                <Switch id='compact-mode' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='notifications' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Email Notifications</Label>
                  <p className='text-sm text-muted-foreground'>
                    Receive notifications via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Push Notifications</Label>
                  <p className='text-sm text-muted-foreground'>
                    Receive push notifications in browser
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Marketing Emails</Label>
                  <p className='text-sm text-muted-foreground'>
                    Receive marketing and promotional emails
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value='security' className='space-y-4 mt-4'>
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='current-password'>Current Password</Label>
                <Input id='current-password' type='password' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='new-password'>New Password</Label>
                <Input id='new-password' type='password' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='confirm-password'>Confirm New Password</Label>
                <Input id='confirm-password' type='password' />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Two-Factor Authentication</Label>
                  <p className='text-sm text-muted-foreground'>
                    Enable two-factor authentication for your account
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

