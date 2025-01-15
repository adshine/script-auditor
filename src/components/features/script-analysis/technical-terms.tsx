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

export function TechnicalTerms({ terms }: TechnicalTermsProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  const visibleTerms = terms.slice(0, 6);
  const remainingTerms = terms.slice(6);
  const hasMoreTerms = remainingTerms.length > 0;

  const TermsList = React.memo(() => (
    <div className="flex flex-wrap gap-2">
      {terms.map((term) => (
        <Badge key={term} variant="secondary">
          {term}
        </Badge>
      ))}
    </div>
  ));

  if (!hasMoreTerms) {
    return (
      <div className="flex flex-wrap gap-2">
        {visibleTerms.map((term) => (
          <Badge key={term} variant="secondary">
            {term}
          </Badge>
        ))}
      </div>
    );
  }

  const ViewMoreButton = (
    <Button variant="outline" size="sm">
      View More ({remainingTerms.length})
    </Button>
  );

  const ModalContent = (
    <>
      <div className="flex flex-wrap gap-2">
        {visibleTerms.map((term) => (
          <Badge key={term} variant="secondary">
            {term}
          </Badge>
        ))}
      </div>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            {ViewMoreButton}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Technical Terms</DialogTitle>
            </DialogHeader>
            <TermsList />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            {ViewMoreButton}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Technical Terms</DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <TermsList />
            </div>
            <DrawerClose asChild>
              <Button className="mx-4 mb-4" variant="outline">Close</Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      {ModalContent}
    </div>
  );
} 