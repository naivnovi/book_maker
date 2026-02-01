import { UiLanguageCode } from './types';

export type UiTextKey =
  | 'appTitle'
  | 'projectName'
  | 'tabEditor'
  | 'tabPreview'
  | 'buttonExportPdf'
  | 'toastExportPlaceholder'
  | 'languageLabel'
  | 'themeLabel'
  | 'themeLight'
  | 'themeDark'
  | 'workspaceTabsLabel'
  | 'sidebarBlocksTitle'
  | 'sidebarOutlineTitle'
  | 'outlineEmpty'
  | 'editorBlocksTitle'
  | 'propertiesTitle'
  | 'documentSettingsTitle'
  | 'trimSizeLabel'
  | 'trimPreset6x9'
  | 'trimPreset85x11'
  | 'trimPreset5x8'
  | 'bleedToggleLabel'
  | 'pageCountLabel'
  | 'gutterWidthLabel'
  | 'selectedBlockTitle'
  | 'noBlockSelected'
  | 'blockTypeParagraph'
  | 'blockTypeHeading'
  | 'blockTypeSectionBreak'
  | 'blockTypePageBreak'
  | 'blockTypeChapterStart'
  | 'blockTypeChecklist'
  | 'blockTypeAnswerLines'
  | 'blockTypeCalloutBox'
  | 'blockTypeImage'
  | 'blockAddLabel'
  | 'blockMoveUpLabel'
  | 'blockMoveDownLabel'
  | 'previewOverlaysTitle'
  | 'overlaySafeArea'
  | 'overlayBleed'
  | 'overlayMargins'
  | 'overlayGutter'
  | 'previewPlaceholderTitle'
  | 'blockFieldHeadingText'
  | 'blockFieldParagraphText'
  | 'blockFieldChapterTitle'
  | 'blockFieldChapterSubtitle'
  | 'blockFieldChecklistTitle'
  | 'blockFieldChecklistItems'
  | 'blockFieldAnswerLinesPrompt'
  | 'blockFieldAnswerLineCount'
  | 'blockFieldCalloutTitle'
  | 'blockFieldCalloutBody'
  | 'blockFieldImageAssetId'
  | 'blockFieldImageCaption'
  | 'blockFieldSectionBreakStyle'
  | 'blockFieldPageBreakNote'
  | 'previewPageLabel'
  | 'previewPlaceholderBody'
  | 'sectionBreakStyleLine'
  | 'sectionBreakStyleSpace'
  | 'sectionBreakStyleOrnament';

export type UiLocalizationDictionary = Record<UiLanguageCode, Record<UiTextKey, string>>;

export const uiLocalizationDictionary: UiLocalizationDictionary = {
  en: {
    appTitle: 'Workbook Publisher',
    projectName: 'Untitled Workbook',
    tabEditor: 'Editor',
    tabPreview: 'Preview',
    buttonExportPdf: 'Export PDF',
    toastExportPlaceholder: 'Export will be implemented in next step',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    workspaceTabsLabel: 'Workspace tabs',
    sidebarBlocksTitle: 'Blocks',
    sidebarOutlineTitle: 'Outline',
    outlineEmpty: 'No chapters yet',
    editorBlocksTitle: 'Workbook Blocks',
    propertiesTitle: 'Properties',
    documentSettingsTitle: 'Document Settings',
    trimSizeLabel: 'Trim size',
    trimPreset6x9: '6 x 9 in',
    trimPreset85x11: '8.5 x 11 in',
    trimPreset5x8: '5 x 8 in',
    bleedToggleLabel: 'Bleed',
    pageCountLabel: 'Estimated page count',
    gutterWidthLabel: 'Gutter width (mm)',
    selectedBlockTitle: 'Selected block',
    noBlockSelected: 'Select a block to edit its properties.',
    blockTypeParagraph: 'Paragraph',
    blockTypeHeading: 'Heading',
    blockTypeSectionBreak: 'Section Break',
    blockTypePageBreak: 'Page Break',
    blockTypeChapterStart: 'Chapter Start',
    blockTypeChecklist: 'Checklist',
    blockTypeAnswerLines: 'Answer Lines',
    blockTypeCalloutBox: 'Callout Box',
    blockTypeImage: 'Image',
    blockAddLabel: 'Add',
    blockMoveUpLabel: 'Move up',
    blockMoveDownLabel: 'Move down',
    previewOverlaysTitle: 'Overlays',
    overlaySafeArea: 'Safe Area',
    overlayBleed: 'Bleed',
    overlayMargins: 'Margins',
    overlayGutter: 'Gutter',
    previewPlaceholderTitle: 'Preview',
    blockFieldHeadingText: 'Heading text',
    blockFieldParagraphText: 'Paragraph text',
    blockFieldChapterTitle: 'Chapter title',
    blockFieldChapterSubtitle: 'Chapter subtitle',
    blockFieldChecklistTitle: 'Checklist title',
    blockFieldChecklistItems: 'Checklist items',
    blockFieldAnswerLinesPrompt: 'Prompt text',
    blockFieldAnswerLineCount: 'Answer line count',
    blockFieldCalloutTitle: 'Callout title',
    blockFieldCalloutBody: 'Callout body',
    blockFieldImageAssetId: 'Image asset id',
    blockFieldImageCaption: 'Image caption',
    blockFieldSectionBreakStyle: 'Section break style',
    blockFieldPageBreakNote: 'Page break note',
    previewPageLabel: 'Page',
    previewPlaceholderBody: 'KDP-ready workbook output',
    sectionBreakStyleLine: 'Line',
    sectionBreakStyleSpace: 'Space',
    sectionBreakStyleOrnament: 'Ornament'
  },
  ru: {
    appTitle: 'Workbook Publisher',
    projectName: 'Без названия',
    tabEditor: 'Редактор',
    tabPreview: 'Предпросмотр',
    buttonExportPdf: 'Экспорт PDF',
    toastExportPlaceholder: 'Экспорт будет реализован на следующем шаге',
    languageLabel: 'Язык',
    themeLabel: 'Тема',
    themeLight: 'Светлая',
    themeDark: 'Тёмная',
    workspaceTabsLabel: 'Вкладки рабочего пространства',
    sidebarBlocksTitle: 'Блоки',
    sidebarOutlineTitle: 'Оглавление',
    outlineEmpty: 'Пока нет глав',
    editorBlocksTitle: 'Блоки книги',
    propertiesTitle: 'Свойства',
    documentSettingsTitle: 'Настройки документа',
    trimSizeLabel: 'Размер обреза',
    trimPreset6x9: '6 x 9 дюймов',
    trimPreset85x11: '8,5 x 11 дюймов',
    trimPreset5x8: '5 x 8 дюймов',
    bleedToggleLabel: 'Вылеты',
    pageCountLabel: 'Оценка страниц',
    gutterWidthLabel: 'Поле переплёта (мм)',
    selectedBlockTitle: 'Выбранный блок',
    noBlockSelected: 'Выберите блок, чтобы изменить его свойства.',
    blockTypeParagraph: 'Абзац',
    blockTypeHeading: 'Заголовок',
    blockTypeSectionBreak: 'Разделитель',
    blockTypePageBreak: 'Разрыв страницы',
    blockTypeChapterStart: 'Начало главы',
    blockTypeChecklist: 'Чек-лист',
    blockTypeAnswerLines: 'Линии ответа',
    blockTypeCalloutBox: 'Выделенный блок',
    blockTypeImage: 'Изображение',
    blockAddLabel: 'Добавить',
    blockMoveUpLabel: 'Вверх',
    blockMoveDownLabel: 'Вниз',
    previewOverlaysTitle: 'Слои',
    overlaySafeArea: 'Безопасная зона',
    overlayBleed: 'Вылеты',
    overlayMargins: 'Поля',
    overlayGutter: 'Переплёт',
    previewPlaceholderTitle: 'Предпросмотр',
    blockFieldHeadingText: 'Текст заголовка',
    blockFieldParagraphText: 'Текст абзаца',
    blockFieldChapterTitle: 'Название главы',
    blockFieldChapterSubtitle: 'Подзаголовок главы',
    blockFieldChecklistTitle: 'Название чек-листа',
    blockFieldChecklistItems: 'Пункты чек-листа',
    blockFieldAnswerLinesPrompt: 'Текст вопроса',
    blockFieldAnswerLineCount: 'Количество строк',
    blockFieldCalloutTitle: 'Заголовок блока',
    blockFieldCalloutBody: 'Текст блока',
    blockFieldImageAssetId: 'Идентификатор изображения',
    blockFieldImageCaption: 'Подпись изображения',
    blockFieldSectionBreakStyle: 'Стиль разделителя',
    blockFieldPageBreakNote: 'Примечание разрыва',
    previewPageLabel: 'Страница',
    previewPlaceholderBody: 'Вывод книги для KDP',
    sectionBreakStyleLine: 'Линия',
    sectionBreakStyleSpace: 'Пробел',
    sectionBreakStyleOrnament: 'Орнамент'
  },
  fr: {
    appTitle: 'Workbook Publisher',
    projectName: 'Cahier sans titre',
    tabEditor: 'Éditeur',
    tabPreview: 'Aperçu',
    buttonExportPdf: 'Exporter PDF',
    toastExportPlaceholder: "L'export sera implémenté à la prochaine étape",
    languageLabel: 'Langue',
    themeLabel: 'Thème',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    workspaceTabsLabel: \"Onglets d'espace de travail\",
    sidebarBlocksTitle: 'Blocs',
    sidebarOutlineTitle: 'Plan',
    outlineEmpty: 'Aucun chapitre pour le moment',
    editorBlocksTitle: 'Blocs du cahier',
    propertiesTitle: 'Propriétés',
    documentSettingsTitle: 'Paramètres du document',
    trimSizeLabel: 'Format',
    trimPreset6x9: '6 x 9 po',
    trimPreset85x11: '8,5 x 11 po',
    trimPreset5x8: '5 x 8 po',
    bleedToggleLabel: 'Fond perdu',
    pageCountLabel: 'Nombre de pages estimé',
    gutterWidthLabel: 'Marge de reliure (mm)',
    selectedBlockTitle: 'Bloc sélectionné',
    noBlockSelected: 'Sélectionnez un bloc pour modifier ses propriétés.',
    blockTypeParagraph: 'Paragraphe',
    blockTypeHeading: 'Titre',
    blockTypeSectionBreak: 'Rupture de section',
    blockTypePageBreak: 'Saut de page',
    blockTypeChapterStart: 'Début de chapitre',
    blockTypeChecklist: 'Liste de contrôle',
    blockTypeAnswerLines: 'Lignes de réponse',
    blockTypeCalloutBox: "Encadré",
    blockTypeImage: 'Image',
    blockAddLabel: 'Ajouter',
    blockMoveUpLabel: 'Monter',
    blockMoveDownLabel: 'Descendre',
    previewOverlaysTitle: 'Superpositions',
    overlaySafeArea: 'Zone sûre',
    overlayBleed: 'Fond perdu',
    overlayMargins: 'Marges',
    overlayGutter: 'Reliure',
    previewPlaceholderTitle: 'Aperçu',
    blockFieldHeadingText: 'Texte du titre',
    blockFieldParagraphText: 'Texte du paragraphe',
    blockFieldChapterTitle: 'Titre du chapitre',
    blockFieldChapterSubtitle: 'Sous-titre du chapitre',
    blockFieldChecklistTitle: 'Titre de la liste',
    blockFieldChecklistItems: 'Éléments de la liste',
    blockFieldAnswerLinesPrompt: 'Texte de la question',
    blockFieldAnswerLineCount: 'Nombre de lignes',
    blockFieldCalloutTitle: "Titre de l'encadré",
    blockFieldCalloutBody: "Texte de l'encadré",
    blockFieldImageAssetId: "Identifiant d'image",
    blockFieldImageCaption: "Légende de l'image",
    blockFieldSectionBreakStyle: 'Style de rupture',
    blockFieldPageBreakNote: 'Note de saut de page',
    previewPageLabel: 'Page',
    previewPlaceholderBody: 'Sortie du cahier prête pour KDP',
    sectionBreakStyleLine: 'Ligne',
    sectionBreakStyleSpace: 'Espace',
    sectionBreakStyleOrnament: 'Ornement'
  }
};
