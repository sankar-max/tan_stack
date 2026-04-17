import { Loader2 } from "lucide-react";

function LoadingDashboard() {
  return (
    <div className="grid place-items-center h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading your dashboard…
        </p>
      </div>
    </div>
  );
}

export default LoadingDashboard;
