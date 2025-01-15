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
import { availableModels, type AIModel } from "@/lib/models";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  showFreeOnly?: boolean;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  showFreeOnly = false
}: ModelSelectorProps) {
  const models = showFreeOnly 
    ? availableModels.filter(model => !model.paid)
    : availableModels;

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(models).map((model) => (
          <SelectGroup key={model.id}>
            <SelectLabel className="flex items-center justify-between">
              <span>{model.provider}</span>
              {!model.paid && (
                <Badge variant="secondary" className="ml-2">
                  Free
                </Badge>
              )}
            </SelectLabel>
            <SelectItem value={model.id} className="py-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{model.name}</span>
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
  );
} 