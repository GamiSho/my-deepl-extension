import { translate } from '../app/translate';
import { getBucket } from '@extend-chrome/storage';

type MyBucket = {
  targetLang: string;
};

const bucket = getBucket<MyBucket>('myBucket', 'sync');

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translate',
    title: 'Translate selected text',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (tab !== undefined) {
    switch (info.menuItemId) {
      case 'translate': {
        const selectedText = info.selectionText !== undefined ? info.selectionText : '';
        const value = await bucket.get('targetLang');
        const userTargetLang = value.targetLang ?? 'EN';
        const translatedText = await translate(selectedText, userTargetLang);
        chrome.tabs.sendMessage(tab.id as number, {
          type: 'SHOW',
          data: {
            lang: userTargetLang,
            translatedText,
            originalText: selectedText,
          },
        });
        break;
      }
    }
  }
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === 'TRNASLATE') {
    const selectedText = message.data.selectedText ?? '';
    const value = await bucket.get('targetLang');
    const userTargetLang = value.targetLang ?? 'EN';
    const translatedText = await translate(selectedText, userTargetLang);
    chrome.tabs.sendMessage(sender.tab?.id as number, {
      type: 'SHOW',
      data: {
        lang: userTargetLang,
        translatedText,
        originalText: selectedText,
      },
    });
  }
});

export {};
