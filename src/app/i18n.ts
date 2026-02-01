import { UiLanguageCode } from './types';
import { UiLocalizationDictionary, UiTextKey } from './i18n-dictionaries';

export function getLocalizedUiText(
  localizationDictionary: UiLocalizationDictionary,
  activeUiLanguageCode: UiLanguageCode,
  uiTextKey: UiTextKey
): string {
  return localizationDictionary[activeUiLanguageCode][uiTextKey];
}
