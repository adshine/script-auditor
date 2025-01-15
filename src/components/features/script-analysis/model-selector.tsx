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
import { Checkbox } from "@/components/ui/checkbox";
import { availableModels, type AIModel } from "@/lib/models";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  showFreeOnly: boolean;
  onShowFreeOnlyChange: (showFree: boolean) => void;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
  showFreeOnly,
  onShowFreeOnlyChange
}: ModelSelectorProps) {
  const filteredModels = showFreeOnly 
    ? availableModels.filter(model => !model.paid)
    : availableModels;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="free-only"
          checked={showFreeOnly}
          onCheckedChange={onShowFreeOnlyChange}
        />
        <label
          htmlFor="free-only"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Free Models Only
        </label>
      </div>

      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a model">
            {availableModels.find(m => m.id === selectedModel)?.name.split(' (')[0]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.values(filteredModels).map((model) => (
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
    </div>
  );
} 