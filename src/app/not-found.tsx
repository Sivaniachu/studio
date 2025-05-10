// src/app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
      <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
      <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Oops! The page you were looking for doesn&apos;t seem to exist. It might have been moved, deleted, or you might have mistyped the URL.
      </p>
      <Button asChild size="lg" className="shadow-md">
        <Link href="/">
          Go Back to Homepage
        </Link>
      </Button>
    </div>
  );
}
