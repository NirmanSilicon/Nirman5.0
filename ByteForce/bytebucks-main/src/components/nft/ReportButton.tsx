// NEW: src/components/nft/ReportButton.tsx
import { Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ReportButtonProps {
  nftId: string;
}

export function ReportButton({ nftId }: ReportButtonProps) {
  const handleReport = (reason: "Inappropriate" | "Stolen") => {
    console.log(`Reporting NFT ${nftId} for reason: ${reason}`);
    // In a real application, you would send this to a backend service.
    // For now, we just log it and show a toast.
    toast({
      title: "NFT has been reported successfully",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Flag className="w-4 h-4 mr-2" />
          Report NFT
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleReport("Inappropriate")}>
          Inappropriate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleReport("Stolen")}>
          Stolen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
