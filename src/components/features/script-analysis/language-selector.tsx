import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/translations";
import { Check } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (languageId: SupportedLanguage) => void;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-[140px] text-sm bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 border-none text-gray-600 !p-0 !justify-start [&>svg]:h-4 [&>svg]:w-4 [&>svg]:opacity-50">
        <SelectValue placeholder="Select language" className="m-0">
          {SUPPORTED_LANGUAGES[selectedLanguage].name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[220px]">
        {Object.entries(SUPPORTED_LANGUAGES).map(([id, { name, nativeName }]) => (
          <SelectGroup key={id}>
            <SelectItem 
              value={id} 
              className="relative py-2 px-4 focus:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{name}</span>
                <span className="text-sm text-gray-500">{nativeName}</span>
              </div>
              {id === selectedLanguage && (
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