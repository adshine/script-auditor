import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/constants";

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (languageId: SupportedLanguage) => void;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.id === selectedLanguage);
  
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-[140px] text-sm bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 border-none text-gray-600 !p-0 !justify-start [&>svg]:h-4 [&>svg]:w-4 [&>svg]:opacity-50">
        <SelectValue placeholder="Select language" className="m-0">
          {selectedLang?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[220px]">
        {SUPPORTED_LANGUAGES.map((language) => (
          <SelectGroup key={language.id}>
            <SelectItem value={language.id} className="relative py-3 px-4">
              <div className="flex items-center gap-2 pl-6">
                <span className="font-medium text-sm">{language.name}</span>
                <span className="text-sm text-gray-500">{language.nativeName}</span>
              </div>
            </SelectItem>
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
} 