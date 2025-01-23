import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { availableModels } from "@/lib/models";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <div className="space-y-4">
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full text-sm border-none">
          <SelectValue placeholder="Select a model">
            {availableModels.find(m => m.id === selectedModel)?.name.split(' (')[0]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => (
            <SelectGroup key={model.id}>
              <SelectItem value={model.id} className="py-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{model.name.replace(' (Google)', '')}</span>
                    {!model.paid && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Free
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {model.description}
                  </p>
                </div>
              </SelectItem>
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 