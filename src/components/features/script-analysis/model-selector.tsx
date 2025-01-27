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
import { Check } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const selectedModelName = availableModels.find(m => m.id === selectedModel)?.name.replace(' (Google)', '') || 'Select a model';
  
  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-[120px] text-sm bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 border-none text-gray-600 !p-0 !justify-start [&>svg]:h-4 [&>svg]:w-4 [&>svg]:opacity-50">
        <SelectValue placeholder="Select model" className="m-0 truncate">
          {selectedModelName}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[240px]">
        {availableModels.map((model) => (
          <SelectGroup key={model.id}>
            <SelectItem 
              value={model.id} 
              className="relative py-2 px-4 focus:bg-gray-50"
            >
              <div className="flex justify-between items-center w-full pr-6">
                <span className="font-medium text-sm">{model.name.replace(' (Google)', '')}</span>
                {!model.paid && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800 hover:bg-gray-100">
                    Free
                  </Badge>
                )}
              </div>
              {model.id === selectedModel && (
                <div className="absolute right-2 top-0 bottom-0 flex items-center">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </SelectItem>
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
} 