import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

type Props = {
  title: string
  description: string
  children: ReactNode
}

export function DialogScrollableContent({
  title,
  description,
  children,
}: Props) {
  return (
    <Dialog open={false}>
      <DialogTrigger data-state={"closed"} asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          rererere {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
