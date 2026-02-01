import {
  addWorkbookBlock,
  getAppWorkspaceState,
  reorderWorkbookBlockByDirection,
  reorderWorkbookBlocksByDrag,
  selectWorkbookBlock,
  setActiveThemeMode,
  setActiveUiLanguageCode,
  setActiveWorkspaceTab,
  subscribeToAppWorkspaceStateChanges,
  updateDocumentSettings,
  updatePreviewOverlayVisibility,
  updateSelectedBlockFields,
  workbookBlockTypeList
} from './state.js';
import { getLocalizedUiText, uiLocalizationDictionary } from './i18n.js';

const previewPageCount = 3;
let draggedBlockId = null;

const domElements = {
  workspaceTabGroup: document.getElementById('workspaceTabGroup'),
  tabEditorButton: document.getElementById('tabEditorButton'),
  tabPreviewButton: document.getElementById('tabPreviewButton'),
  exportButton: document.getElementById('exportButton'),
  languageToggle: document.getElementById('languageToggle'),
  themeToggle: document.getElementById('themeToggle'),
  themeLightButton: document.getElementById('themeLightButton'),
  themeDarkButton: document.getElementById('themeDarkButton'),
  blockButtonContainer: document.getElementById('blockButtonContainer'),
  outlineListContainer: document.getElementById('outlineListContainer'),
  blockListContainer: document.getElementById('blockListContainer'),
  blockPropertiesContainer: document.getElementById('blockPropertiesContainer'),
  trimSizeSelect: document.getElementById('trimSizeSelect'),
  bleedToggle: document.getElementById('bleedToggle'),
  pageCountInput: document.getElementById('pageCountInput'),
  gutterWidthInput: document.getElementById('gutterWidthInput'),
  editorPanel: document.getElementById('editorPanel'),
  previewPanel: document.getElementById('previewPanel'),
  overlayToggleGroup: document.getElementById('overlayToggleGroup'),
  previewCanvas: document.getElementById('previewCanvas'),
  toastRegion: document.getElementById('toastRegion')
};

const blockTypeUiTextKeyMap = {
  paragraph: 'blockTypeParagraph',
  heading: 'blockTypeHeading',
  sectionBreak: 'blockTypeSectionBreak',
  pageBreak: 'blockTypePageBreak',
  chapterStart: 'blockTypeChapterStart',
  checklist: 'blockTypeChecklist',
  answerLines: 'blockTypeAnswerLines',
  calloutBox: 'blockTypeCalloutBox',
  image: 'blockTypeImage'
};

const sectionBreakStyleUiTextKeyMap = {
  line: 'sectionBreakStyleLine',
  space: 'sectionBreakStyleSpace',
  ornament: 'sectionBreakStyleOrnament'
};

initializeApp();

function initializeApp() {
  domElements.tabEditorButton.addEventListener('click', () => setActiveWorkspaceTab('editor'));
  domElements.tabPreviewButton.addEventListener('click', () => setActiveWorkspaceTab('preview'));

  domElements.exportButton.addEventListener('click', () => {
    showToastMessage(getUiText('toastExportPlaceholder'));
  });

  domElements.languageToggle.addEventListener('click', (clickEvent) => {
    const targetElement = clickEvent.target.closest('[data-language-code]');
    if (!targetElement) {
      return;
    }
    const languageCode = targetElement.getAttribute('data-language-code');
    if (languageCode) {
      setActiveUiLanguageCode(languageCode);
    }
  });

  domElements.themeToggle.addEventListener('click', (clickEvent) => {
    const targetElement = clickEvent.target.closest('[data-theme-mode]');
    if (!targetElement) {
      return;
    }
    const themeMode = targetElement.getAttribute('data-theme-mode');
    if (themeMode) {
      setActiveThemeMode(themeMode);
    }
  });

  domElements.blockButtonContainer.addEventListener('click', (clickEvent) => {
    const targetElement = clickEvent.target.closest('[data-block-type]');
    if (!targetElement) {
      return;
    }
    const blockType = targetElement.getAttribute('data-block-type');
    if (blockType) {
      addWorkbookBlock(blockType);
    }
  });

  domElements.outlineListContainer.addEventListener('click', (clickEvent) => {
    const targetElement = clickEvent.target.closest('[data-block-id]');
    if (!targetElement) {
      return;
    }
    const blockId = targetElement.getAttribute('data-block-id');
    if (blockId) {
      selectWorkbookBlock(blockId);
    }
  });

  domElements.blockListContainer.addEventListener('click', (clickEvent) => {
    const targetElement = clickEvent.target.closest('[data-block-action]');
    if (!targetElement) {
      return;
    }
    const blockId = targetElement.getAttribute('data-block-id');
    const blockAction = targetElement.getAttribute('data-block-action');
    if (!blockId || !blockAction) {
      return;
    }
    if (blockAction === 'select') {
      selectWorkbookBlock(blockId);
      return;
    }
    if (blockAction === 'move-up') {
      reorderWorkbookBlockByDirection(blockId, 'up');
      return;
    }
    if (blockAction === 'move-down') {
      reorderWorkbookBlockByDirection(blockId, 'down');
    }
  });

  domElements.overlayToggleGroup.addEventListener('click', (clickEvent) => {
    const targetElement = clickEvent.target.closest('[data-overlay-key]');
    if (!targetElement) {
      return;
    }
    const overlayKey = targetElement.getAttribute('data-overlay-key');
    if (!overlayKey) {
      return;
    }
    const appWorkspaceState = getAppWorkspaceState();
    const nextOverlayValue = !appWorkspaceState.previewOverlayVisibility[overlayKey];
    updatePreviewOverlayVisibility({ [overlayKey]: nextOverlayValue });
  });

  domElements.trimSizeSelect.addEventListener('change', (changeEvent) => {
    const selectedTrimSizePresetId = changeEvent.target.value;
    updateDocumentSettings({ trimSizePresetId: selectedTrimSizePresetId });
  });

  domElements.bleedToggle.addEventListener('change', (changeEvent) => {
    updateDocumentSettings({ isBleedEnabled: changeEvent.target.checked });
  });

  domElements.pageCountInput.addEventListener('input', (inputEvent) => {
    const parsedPageCount = Number(inputEvent.target.value);
    updateDocumentSettings({
      estimatedPageCount: Number.isNaN(parsedPageCount) ? 0 : parsedPageCount
    });
  });

  subscribeToAppWorkspaceStateChanges(renderAppWorkspaceState);
  renderAppWorkspaceState(getAppWorkspaceState());
}

function getUiText(uiTextKey) {
  const appWorkspaceState = getAppWorkspaceState();
  return getLocalizedUiText(uiLocalizationDictionary, appWorkspaceState.activeUiLanguageCode, uiTextKey);
}

function renderAppWorkspaceState(appWorkspaceState) {
  document.documentElement.setAttribute('data-theme', appWorkspaceState.activeThemeMode);

  renderStaticUiTextElements(appWorkspaceState.activeUiLanguageCode);
  renderTabs(appWorkspaceState.activeWorkspaceTab);
  renderSegmentedToggles(appWorkspaceState);
  renderBlockAddButtons();
  renderOutlineList(appWorkspaceState);
  renderBlockList(appWorkspaceState);
  renderDocumentSettings(appWorkspaceState);
  renderBlockProperties(appWorkspaceState);
  renderPreviewPanel(appWorkspaceState);
}

function renderStaticUiTextElements(activeUiLanguageCode) {
  const uiTextElements = document.querySelectorAll('[data-ui-text-key]');
  uiTextElements.forEach((uiTextElement) => {
    const uiTextKey = uiTextElement.getAttribute('data-ui-text-key');
    if (uiTextKey) {
      uiTextElement.textContent = getLocalizedUiText(uiLocalizationDictionary, activeUiLanguageCode, uiTextKey);
    }
  });

  domElements.workspaceTabGroup.setAttribute('aria-label', getUiText('workspaceTabsLabel'));
  domElements.languageToggle.setAttribute('aria-label', getUiText('languageLabel'));
  domElements.themeToggle.setAttribute('aria-label', getUiText('themeLabel'));
  domElements.exportButton.textContent = getUiText('buttonExportPdf');
  domElements.tabEditorButton.textContent = getUiText('tabEditor');
  domElements.tabPreviewButton.textContent = getUiText('tabPreview');
  domElements.themeLightButton.textContent = getUiText('themeLight');
  domElements.themeDarkButton.textContent = getUiText('themeDark');

  const overlayButtons = domElements.overlayToggleGroup.querySelectorAll('[data-overlay-key]');
  overlayButtons.forEach((overlayButton) => {
    const overlayKey = overlayButton.getAttribute('data-overlay-key');
    if (overlayKey === 'isSafeAreaVisible') {
      overlayButton.textContent = getUiText('overlaySafeArea');
    } else if (overlayKey === 'isBleedVisible') {
      overlayButton.textContent = getUiText('overlayBleed');
    } else if (overlayKey === 'isMarginsVisible') {
      overlayButton.textContent = getUiText('overlayMargins');
    } else if (overlayKey === 'isGutterVisible') {
      overlayButton.textContent = getUiText('overlayGutter');
    }
  });
}

function renderTabs(activeWorkspaceTab) {
  domElements.tabEditorButton.classList.toggle('is-active', activeWorkspaceTab === 'editor');
  domElements.tabPreviewButton.classList.toggle('is-active', activeWorkspaceTab === 'preview');
  domElements.editorPanel.classList.toggle('is-hidden', activeWorkspaceTab !== 'editor');
  domElements.previewPanel.classList.toggle('is-hidden', activeWorkspaceTab !== 'preview');
}

function renderSegmentedToggles(appWorkspaceState) {
  const languageButtons = domElements.languageToggle.querySelectorAll('[data-language-code]');
  languageButtons.forEach((languageButton) => {
    const languageCode = languageButton.getAttribute('data-language-code');
    languageButton.classList.toggle('is-active', languageCode === appWorkspaceState.activeUiLanguageCode);
  });

  const themeButtons = domElements.themeToggle.querySelectorAll('[data-theme-mode]');
  themeButtons.forEach((themeButton) => {
    const themeMode = themeButton.getAttribute('data-theme-mode');
    themeButton.classList.toggle('is-active', themeMode === appWorkspaceState.activeThemeMode);
  });
}

function renderBlockAddButtons() {
  domElements.blockButtonContainer.innerHTML = '';
  workbookBlockTypeList.forEach((blockType) => {
    const blockButton = document.createElement('button');
    blockButton.type = 'button';
    blockButton.className = 'secondary-button';
    blockButton.setAttribute('data-block-type', blockType);
    blockButton.textContent = `${getUiText('blockAddLabel')} ${getUiText(blockTypeUiTextKeyMap[blockType])}`;
    domElements.blockButtonContainer.appendChild(blockButton);
  });
}

function renderOutlineList(appWorkspaceState) {
  domElements.outlineListContainer.innerHTML = '';
  const chapterBlocks = appWorkspaceState.workbookBlocks.filter(
    (workbookBlock) => workbookBlock.blockType === 'chapterStart'
  );

  if (chapterBlocks.length === 0) {
    const emptyStateElement = document.createElement('div');
    emptyStateElement.className = 'muted-text';
    emptyStateElement.textContent = getUiText('outlineEmpty');
    domElements.outlineListContainer.appendChild(emptyStateElement);
    return;
  }

  chapterBlocks.forEach((chapterBlock) => {
    const outlineButton = document.createElement('button');
    outlineButton.type = 'button';
    outlineButton.className = 'outline-entry';
    outlineButton.setAttribute('data-block-id', chapterBlock.blockId);
    outlineButton.textContent = chapterBlock.chapterTitleText;
    domElements.outlineListContainer.appendChild(outlineButton);
  });
}

function renderBlockList(appWorkspaceState) {
  domElements.blockListContainer.innerHTML = '';
  appWorkspaceState.workbookBlocks.forEach((workbookBlock, blockIndex) => {
    const blockEntry = document.createElement('div');
    blockEntry.className = 'block-list-entry';
    blockEntry.setAttribute('data-block-id', workbookBlock.blockId);
    blockEntry.setAttribute('aria-grabbed', draggedBlockId === workbookBlock.blockId ? 'true' : 'false');
    blockEntry.draggable = true;
    blockEntry.addEventListener('dragstart', (dragStartEvent) => {
      draggedBlockId = workbookBlock.blockId;
      dragStartEvent.dataTransfer.setData('text/plain', workbookBlock.blockId);
      dragStartEvent.dataTransfer.effectAllowed = 'move';
      renderBlockList(getAppWorkspaceState());
    });
    blockEntry.addEventListener('dragover', (dragOverEvent) => {
      dragOverEvent.preventDefault();
      dragOverEvent.dataTransfer.dropEffect = 'move';
    });
    blockEntry.addEventListener('drop', (dropEvent) => {
      dropEvent.preventDefault();
      const sourceBlockId = dropEvent.dataTransfer.getData('text/plain');
      if (sourceBlockId) {
        reorderWorkbookBlocksByDrag(sourceBlockId, workbookBlock.blockId);
      }
      draggedBlockId = null;
    });
    blockEntry.addEventListener('dragend', () => {
      draggedBlockId = null;
      renderBlockList(getAppWorkspaceState());
    });

    if (workbookBlock.blockId === appWorkspaceState.selectedWorkbookBlockId) {
      blockEntry.classList.add('is-selected');
    }

    const blockContentButton = document.createElement('button');
    blockContentButton.type = 'button';
    blockContentButton.className = 'block-list-content';
    blockContentButton.setAttribute('data-block-action', 'select');
    blockContentButton.setAttribute('data-block-id', workbookBlock.blockId);

    const blockLabelElement = document.createElement('div');
    blockLabelElement.className = 'block-list-label';
    blockLabelElement.textContent = getUiText(blockTypeUiTextKeyMap[workbookBlock.blockType]);

    const blockPreviewElement = document.createElement('div');
    blockPreviewElement.className = 'block-list-preview';
    blockPreviewElement.textContent = getBlockPreviewText(workbookBlock);

    blockContentButton.appendChild(blockLabelElement);
    blockContentButton.appendChild(blockPreviewElement);

    const blockActions = document.createElement('div');
    blockActions.className = 'block-list-actions';

    const moveUpButton = document.createElement('button');
    moveUpButton.type = 'button';
    moveUpButton.className = 'icon-button';
    moveUpButton.textContent = '↑';
    moveUpButton.disabled = blockIndex === 0;
    moveUpButton.setAttribute('data-block-action', 'move-up');
    moveUpButton.setAttribute('data-block-id', workbookBlock.blockId);
    moveUpButton.setAttribute('aria-label', getUiText('blockMoveUpLabel'));

    const moveDownButton = document.createElement('button');
    moveDownButton.type = 'button';
    moveDownButton.className = 'icon-button';
    moveDownButton.textContent = '↓';
    moveDownButton.disabled = blockIndex === appWorkspaceState.workbookBlocks.length - 1;
    moveDownButton.setAttribute('data-block-action', 'move-down');
    moveDownButton.setAttribute('data-block-id', workbookBlock.blockId);
    moveDownButton.setAttribute('aria-label', getUiText('blockMoveDownLabel'));

    blockActions.appendChild(moveUpButton);
    blockActions.appendChild(moveDownButton);

    blockEntry.appendChild(blockContentButton);
    blockEntry.appendChild(blockActions);

    domElements.blockListContainer.appendChild(blockEntry);
  });
}

function getBlockPreviewText(workbookBlock) {
  switch (workbookBlock.blockType) {
    case 'paragraph':
      return workbookBlock.paragraphText;
    case 'heading':
      return workbookBlock.headingText;
    case 'sectionBreak':
      return workbookBlock.sectionBreakStyleId;
    case 'pageBreak':
      return workbookBlock.pageBreakNote;
    case 'chapterStart':
      return workbookBlock.chapterTitleText;
    case 'checklist':
      return workbookBlock.checklistTitleText;
    case 'answerLines':
      return workbookBlock.answerLinesPromptText;
    case 'calloutBox':
      return workbookBlock.calloutTitleText;
    case 'image':
      return workbookBlock.imageCaptionText;
    default:
      return '';
  }
}

function renderDocumentSettings(appWorkspaceState) {
  domElements.trimSizeSelect.innerHTML = '';
  const trimSizeOptions = [
    { value: 'trim_6x9', label: getUiText('trimPreset6x9') },
    { value: 'trim_85x11', label: getUiText('trimPreset85x11') },
    { value: 'trim_5x8', label: getUiText('trimPreset5x8') }
  ];
  trimSizeOptions.forEach((trimSizeOption) => {
    const optionElement = document.createElement('option');
    optionElement.value = trimSizeOption.value;
    optionElement.textContent = trimSizeOption.label;
    domElements.trimSizeSelect.appendChild(optionElement);
  });

  domElements.trimSizeSelect.value = appWorkspaceState.documentSettings.trimSizePresetId;
  domElements.bleedToggle.checked = appWorkspaceState.documentSettings.isBleedEnabled;
  domElements.pageCountInput.value = appWorkspaceState.documentSettings.estimatedPageCount;
  domElements.gutterWidthInput.value = appWorkspaceState.documentSettings.calculatedGutterWidthMillimeters;
}

function renderBlockProperties(appWorkspaceState) {
  const selectedBlock = appWorkspaceState.workbookBlocks.find(
    (workbookBlock) => workbookBlock.blockId === appWorkspaceState.selectedWorkbookBlockId
  );

  domElements.blockPropertiesContainer.innerHTML = '';

  if (!selectedBlock) {
    const emptyStateElement = document.createElement('div');
    emptyStateElement.className = 'muted-text';
    emptyStateElement.textContent = getUiText('noBlockSelected');
    domElements.blockPropertiesContainer.appendChild(emptyStateElement);
    return;
  }

  const formStackElement = document.createElement('div');
  formStackElement.className = 'form-stack';

  if (selectedBlock.blockType === 'heading') {
    formStackElement.appendChild(
      createTextInputField('blockFieldHeadingText', selectedBlock.headingText, 'headingText')
    );
  } else if (selectedBlock.blockType === 'paragraph') {
    formStackElement.appendChild(
      createTextareaField('blockFieldParagraphText', selectedBlock.paragraphText, 'paragraphText')
    );
  } else if (selectedBlock.blockType === 'chapterStart') {
    formStackElement.appendChild(
      createTextInputField('blockFieldChapterTitle', selectedBlock.chapterTitleText, 'chapterTitleText')
    );
    formStackElement.appendChild(
      createTextInputField(
        'blockFieldChapterSubtitle',
        selectedBlock.chapterSubtitleText,
        'chapterSubtitleText'
      )
    );
  } else if (selectedBlock.blockType === 'checklist') {
    formStackElement.appendChild(
      createTextInputField(
        'blockFieldChecklistTitle',
        selectedBlock.checklistTitleText,
        'checklistTitleText'
      )
    );
    formStackElement.appendChild(
      createTextareaField(
        'blockFieldChecklistItems',
        selectedBlock.checklistItems.join('\n'),
        'checklistItems'
      )
    );
  } else if (selectedBlock.blockType === 'answerLines') {
    formStackElement.appendChild(
      createTextInputField(
        'blockFieldAnswerLinesPrompt',
        selectedBlock.answerLinesPromptText,
        'answerLinesPromptText'
      )
    );
    formStackElement.appendChild(
      createNumberInputField(
        'blockFieldAnswerLineCount',
        selectedBlock.answerLineCount,
        'answerLineCount'
      )
    );
  } else if (selectedBlock.blockType === 'calloutBox') {
    formStackElement.appendChild(
      createTextInputField(
        'blockFieldCalloutTitle',
        selectedBlock.calloutTitleText,
        'calloutTitleText'
      )
    );
    formStackElement.appendChild(
      createTextareaField(
        'blockFieldCalloutBody',
        selectedBlock.calloutBodyText,
        'calloutBodyText'
      )
    );
  } else if (selectedBlock.blockType === 'image') {
    formStackElement.appendChild(
      createTextInputField(
        'blockFieldImageAssetId',
        selectedBlock.imageAssetId,
        'imageAssetId'
      )
    );
    formStackElement.appendChild(
      createTextInputField(
        'blockFieldImageCaption',
        selectedBlock.imageCaptionText,
        'imageCaptionText'
      )
    );
  } else if (selectedBlock.blockType === 'sectionBreak') {
    formStackElement.appendChild(
      createSelectField(
        'blockFieldSectionBreakStyle',
        selectedBlock.sectionBreakStyleId,
        'sectionBreakStyleId',
        [
          { value: 'line', label: getUiText(sectionBreakStyleUiTextKeyMap.line) },
          { value: 'space', label: getUiText(sectionBreakStyleUiTextKeyMap.space) },
          { value: 'ornament', label: getUiText(sectionBreakStyleUiTextKeyMap.ornament) }
        ]
      )
    );
  } else if (selectedBlock.blockType === 'pageBreak') {
    formStackElement.appendChild(
      createTextInputField(
        'blockFieldPageBreakNote',
        selectedBlock.pageBreakNote,
        'pageBreakNote'
      )
    );
  }

  domElements.blockPropertiesContainer.appendChild(formStackElement);
}

function createTextInputField(labelKey, fieldValue, fieldKey) {
  const fieldContainer = document.createElement('label');
  fieldContainer.className = 'form-field';

  const labelElement = document.createElement('span');
  labelElement.className = 'form-label';
  labelElement.textContent = getUiText(labelKey);

  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.className = 'form-input';
  inputElement.value = fieldValue;
  inputElement.setAttribute('data-block-field', fieldKey);
  inputElement.addEventListener('input', (inputEvent) => {
    updateSelectedBlockFields({ [fieldKey]: inputEvent.target.value });
  });

  fieldContainer.appendChild(labelElement);
  fieldContainer.appendChild(inputElement);
  return fieldContainer;
}

function createNumberInputField(labelKey, fieldValue, fieldKey) {
  const fieldContainer = document.createElement('label');
  fieldContainer.className = 'form-field';

  const labelElement = document.createElement('span');
  labelElement.className = 'form-label';
  labelElement.textContent = getUiText(labelKey);

  const inputElement = document.createElement('input');
  inputElement.type = 'number';
  inputElement.className = 'form-input';
  inputElement.value = fieldValue;
  inputElement.min = 1;
  inputElement.setAttribute('data-block-field', fieldKey);
  inputElement.addEventListener('input', (inputEvent) => {
    const parsedValue = Number(inputEvent.target.value);
    updateSelectedBlockFields({ [fieldKey]: Number.isNaN(parsedValue) ? 1 : parsedValue });
  });

  fieldContainer.appendChild(labelElement);
  fieldContainer.appendChild(inputElement);
  return fieldContainer;
}

function createTextareaField(labelKey, fieldValue, fieldKey) {
  const fieldContainer = document.createElement('label');
  fieldContainer.className = 'form-field';

  const labelElement = document.createElement('span');
  labelElement.className = 'form-label';
  labelElement.textContent = getUiText(labelKey);

  const textareaElement = document.createElement('textarea');
  textareaElement.className = 'form-textarea';
  textareaElement.value = fieldValue;
  textareaElement.setAttribute('data-block-field', fieldKey);
  textareaElement.addEventListener('input', (inputEvent) => {
    const inputValue = inputEvent.target.value;
    if (fieldKey === 'checklistItems') {
      updateSelectedBlockFields({ checklistItems: inputValue.split('\n').filter(Boolean) });
      return;
    }
    updateSelectedBlockFields({ [fieldKey]: inputValue });
  });

  fieldContainer.appendChild(labelElement);
  fieldContainer.appendChild(textareaElement);
  return fieldContainer;
}

function createSelectField(labelKey, fieldValue, fieldKey, options) {
  const fieldContainer = document.createElement('label');
  fieldContainer.className = 'form-field';

  const labelElement = document.createElement('span');
  labelElement.className = 'form-label';
  labelElement.textContent = getUiText(labelKey);

  const selectElement = document.createElement('select');
  selectElement.className = 'form-select';
  selectElement.setAttribute('data-block-field', fieldKey);

  options.forEach((optionDefinition) => {
    const optionElement = document.createElement('option');
    optionElement.value = optionDefinition.value;
    optionElement.textContent = optionDefinition.label;
    selectElement.appendChild(optionElement);
  });

  selectElement.value = fieldValue;

  selectElement.addEventListener('change', (changeEvent) => {
    updateSelectedBlockFields({ [fieldKey]: changeEvent.target.value });
  });

  fieldContainer.appendChild(labelElement);
  fieldContainer.appendChild(selectElement);
  return fieldContainer;
}

function renderPreviewPanel(appWorkspaceState) {
  const overlayButtons = domElements.overlayToggleGroup.querySelectorAll('[data-overlay-key]');
  overlayButtons.forEach((overlayButton) => {
    const overlayKey = overlayButton.getAttribute('data-overlay-key');
    if (!overlayKey) {
      return;
    }
    overlayButton.classList.toggle('is-active', appWorkspaceState.previewOverlayVisibility[overlayKey]);
  });

  domElements.previewCanvas.innerHTML = '';
  for (let pageIndex = 0; pageIndex < previewPageCount; pageIndex += 1) {
    const previewPage = document.createElement('div');
    previewPage.className = 'preview-page';

    const previewPageLabel = document.createElement('div');
    previewPageLabel.className = 'preview-page-label';
    previewPageLabel.textContent = `${getUiText('previewPageLabel')} ${pageIndex + 1}`;

    const previewPageContent = document.createElement('div');
    previewPageContent.className = 'preview-page-content';

    const previewTitle = document.createElement('div');
    previewTitle.className = 'preview-placeholder-title';
    previewTitle.textContent = getUiText('previewPlaceholderTitle');

    const previewBody = document.createElement('div');
    previewBody.className = 'preview-placeholder-body';
    previewBody.textContent = getUiText('previewPlaceholderBody');

    previewPageContent.appendChild(previewTitle);
    previewPageContent.appendChild(previewBody);

    previewPage.appendChild(previewPageLabel);
    previewPage.appendChild(previewPageContent);

    if (appWorkspaceState.previewOverlayVisibility.isBleedVisible) {
      const overlayBleed = document.createElement('div');
      overlayBleed.className = 'overlay-bleed';
      previewPage.appendChild(overlayBleed);
    }
    if (appWorkspaceState.previewOverlayVisibility.isMarginsVisible) {
      const overlayMargins = document.createElement('div');
      overlayMargins.className = 'overlay-margins';
      previewPage.appendChild(overlayMargins);
    }
    if (appWorkspaceState.previewOverlayVisibility.isSafeAreaVisible) {
      const overlaySafe = document.createElement('div');
      overlaySafe.className = 'overlay-safe';
      previewPage.appendChild(overlaySafe);
    }
    if (appWorkspaceState.previewOverlayVisibility.isGutterVisible) {
      const overlayGutter = document.createElement('div');
      overlayGutter.className = 'overlay-gutter';
      previewPage.appendChild(overlayGutter);
    }

    domElements.previewCanvas.appendChild(previewPage);
  }
}

function showToastMessage(message) {
  const toastMessage = document.createElement('div');
  toastMessage.className = 'toast-message';
  toastMessage.textContent = message;
  domElements.toastRegion.appendChild(toastMessage);

  window.setTimeout(() => {
    toastMessage.remove();
  }, 2500);
}
