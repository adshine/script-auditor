"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"

interface TechnicalTermsProps {
  terms: string[];
}

const TermsList = React.memo(({ terms }: { terms: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {terms.map((term) => (
      <Badge key={term} variant="secondary">
        {term}
      </Badge>
    ))}
  </div>
));
TermsList.displayName = 'TermsList';

export function TechnicalTerms({ terms }: TechnicalTermsProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const visibleTerms = terms.slice(0, 6);
  const remainingTerms = terms.slice(6);
  const hasMoreTerms = remainingTerms.length > 0;

  if (!hasMoreTerms) {
    return <TermsList terms={visibleTerms} />;
  }

  const ViewMoreButton = React.memo(() => (
    <Button variant="outline" size="sm">
      View More ({remainingTerms.length})
    </Button>
  ));
  ViewMoreButton.displayName = 'ViewMoreButton';

  if (isDesktop === null) {
    // Return a loading state or initial state while we determine the screen size
    return <TermsList terms={visibleTerms} />;
  }

  return (
    <div className="space-y-4">
      <TermsList terms={visibleTerms} />
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <ViewMoreButton />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Technical Terms</DialogTitle>
            </DialogHeader>
            <TermsList terms={terms} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <ViewMoreButton />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Technical Terms</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <TermsList terms={terms} />
            </div>
            <DrawerClose asChild>
              <Button className="mx-4 mb-4" variant="outline">Close</Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
} 