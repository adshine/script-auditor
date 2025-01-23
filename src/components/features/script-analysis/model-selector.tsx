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
  const selectedModelName = availableModels.find(m => m.id === selectedModel)?.name.replace(' (Google)', '') || 'Select a model';
  
  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger className="w-full text-sm bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 border-none text-gray-600 !p-0 !justify-start [&>svg]:ml-1 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:opacity-50">
        <SelectValue placeholder="Select a model" className="m-0">
          {selectedModelName}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[320px]">
        {availableModels.map((model) => (
          <SelectGroup key={model.id}>
            <SelectItem value={model.id} className="py-3 px-4 relative">
              <div className="flex items-center justify-between gap-3 pl-6">
                <span className="font-medium text-sm">{model.name.replace(' (Google)', '')}</span>
                {!model.paid && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800 hover:bg-gray-100">
                    Free
                  </Badge>
                )}
              </div>
            </SelectItem>
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
} 