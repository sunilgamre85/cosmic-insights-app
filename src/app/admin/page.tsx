import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Newspaper, Bot, Settings, BarChart } from "lucide-react";

const adminSections = [
    {
        title: "User Management",
        description: "View and manage user data and subscriptions.",
        icon: <Users className="h-8 w-8 text-primary" />,
        link: "#",
    },
    {
        title: "Blog Content",
        description: "Create, edit, and delete blog posts.",
        icon: <Newspaper className="h-8 w-8 text-primary" />,
        link: "#",
    },
    {
        title: "AI Settings",
        description: "Configure and monitor AI models and prompts.",
        icon: <Bot className="h-8 w-8 text-primary" />,
        link: "#",
    },
    {
        title: "Analytics",
        description: "Review site traffic and feature usage statistics.",
        icon: <BarChart className="h-8 w-8 text-primary" />,
        link: "#",
    },
    {
        title: "App Settings",
        description: "Manage global application settings and integrations.",
        icon: <Settings className="h-8 w-8 text-primary" />,
        link: "#",
    }
]

export default function AdminPage() {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <PageHeader
                title="Admin Panel"
                description="Welcome to the control center for Cosmic Insights."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {adminSections.map((section) => (
                <Card key={section.title} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    {section.icon}
                    <CardTitle className="font-headline">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{section.description}</p>
                  </CardContent>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                        Go to Section
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
        </div>
    );
}
