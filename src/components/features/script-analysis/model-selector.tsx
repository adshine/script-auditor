import { availableModels } from '@/lib/models';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  onShowFreeOnlyChange,
}: ModelSelectorProps) {
  const models = showFreeOnly
    ? availableModels.filter((model) => model.isFree)
    : availableModels;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
                {model.isFree && ' (Free)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2 whitespace-nowrap">
        <Checkbox
          id="show-free"
          checked={showFreeOnly}
          onCheckedChange={(checked) => onShowFreeOnlyChange(checked as boolean)}
        />
        <Label htmlFor="show-free" className="text-sm font-normal cursor-pointer">
          Show Free Models Only
        </Label>
      </div>
    </div>
  );
} 