import { motion } from "motion/react";
import { Bell, Shield, Palette, Globe, User, Volume2 } from "lucide-react";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { useState } from "react";

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [volume, setVolume] = useState(70);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div>
            <h1>Settings</h1>
            <p className="text-muted-foreground">Customize your Fin-Forge experience</p>
          </div>

          {/* Account Settings */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3>Account</h3>
                  <p className="text-muted-foreground">Manage your account information</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Display Name</Label>
                    <p className="text-muted-foreground">Financial Master</p>
                  </div>
                  <Button variant="outline">Edit</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email</Label>
                    <p className="text-muted-foreground">user@example.com</p>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password</Label>
                    <p className="text-muted-foreground">••••••••</p>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--success)]/10 rounded-lg">
                  <Bell className="w-5 h-5 text-[var(--success)]" />
                </div>
                <div>
                  <h3>Notifications</h3>
                  <p className="text-muted-foreground">Configure your notification preferences</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Push Notifications</Label>
                    <p className="text-muted-foreground">Receive notifications about your progress</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Daily Reminders</Label>
                    <p className="text-muted-foreground">Get reminded to continue your learning streak</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Achievement Alerts</Label>
                    <p className="text-muted-foreground">Be notified when you unlock new badges</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Weekly Summary</Label>
                    <p className="text-muted-foreground">Receive a weekly progress report</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Palette className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h3>Appearance</h3>
                  <p className="text-muted-foreground">Customize how Fin-Forge looks</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">Choose your preferred color scheme</p>
                </div>

                <div className="space-y-2">
                  <Label>Contrast Mode</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High Contrast</SelectItem>
                      <SelectItem value="low">Low Contrast</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground">Adjust contrast for better readability</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Font Size</Label>
                    <span className="text-muted-foreground">{fontSize}px</span>
                  </div>
                  <Slider
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    min={12}
                    max={24}
                    step={1}
                  />
                  <p className="text-muted-foreground">Adjust text size for comfort</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Audio */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Volume2 className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3>Audio</h3>
                  <p className="text-muted-foreground">Configure sound settings</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Sound Effects</Label>
                    <p className="text-muted-foreground">Play sounds for actions and achievements</p>
                  </div>
                  <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Background Music</Label>
                    <p className="text-muted-foreground">Play ambient music during simulators</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Volume</Label>
                    <span className="text-muted-foreground">{volume}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    onValueChange={([value]) => setVolume(value)}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy & Data */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--risk)]/10 rounded-lg">
                  <Shield className="w-5 h-5 text-[var(--risk)]" />
                </div>
                <div>
                  <h3>Privacy & Data</h3>
                  <p className="text-muted-foreground">Manage your data and privacy settings</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-save Progress</Label>
                    <p className="text-muted-foreground">Automatically save your progress during simulators</p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Usage Analytics</Label>
                    <p className="text-muted-foreground">Help us improve by sharing usage data</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-[var(--risk)]">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Language & Region */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3>Language & Region</h3>
                  <p className="text-muted-foreground">Set your preferred language and region</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="cst">Central Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
