import { useState } from 'react';
import { MdDone, MdOutlineContentCopy, MdVolumeUp } from 'react-icons/md';
import '@mantine/core/styles.css';
import {
  MantineProvider,
  ActionIcon,
  Avatar,
  Box,
  CopyButton,
  Divider,
  Flex,
  Group,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { translate } from '../app/translate';
import { getBucket } from '@extend-chrome/storage';

type MyBucket = {
  targetLang: string;
};

const bucket = getBucket<MyBucket>('targetLang');

export const Content = ({
  translatedText,
  originalText,
  targetLang,
}: {
  translatedText: string;
  originalText: string;
  targetLang: string;
}) => {
  console.log(originalText);
  const [isOpen, setIsOpen] = useState(true);
  const [dialog, setDialog] = useState<HTMLDivElement | null>(null);
  const [text, setText] = useState(translatedText);
  const [lang, setLang] = useState(targetLang);

  useClickOutside(() => setIsOpen(false), null, [dialog]);

  const IconUrl = chrome.runtime.getURL('images/extension_128.png');

  const handleLangChange = (value: string | null) => {
    if (!value) return;

    bucket.set({ targetLang: value });
    translate(originalText, value).then((res) => {
      setText(res);
      setLang(value);
    });
  };
  return isOpen ? (
    <MantineProvider>
      <Box
        style={(theme) => ({
          backgroundColor: 'white',
          textAlign: 'left',
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
          maxWidth: 400,
          boxShadow: '0 0 10px rgba(0,0,0,.3)',
          zIndex: 2147483550,
        })}
        component="div"
        ref={setDialog}
      >
        <Flex pb="xs" gap="xs" justify="flex-start" align="center">
          <Avatar src={IconUrl} />
          <Text size="md">Language</Text>
          <Select
            size="xs"
            value={lang}
            onChange={(value: string | null) => handleLangChange(value)}
            data={[
              { value: 'EN', label: 'English' },
              { value: 'KO', label: 'Korean' },
              { value: 'ZH', label: 'Chinese' },
              { value: 'JA', label: 'Japanese' },
            ]}
          />
        </Flex>
        <Divider />
        <Stack pt="sm" gap="xs" style={{ textAlign: 'left' }}>
          <Text size="sm">{text}</Text>
          <Group align="right" gap="xs">
            {/* 3. */}
            <Tooltip label="音声読み上げ" withArrow>
              <ActionIcon>
                <MdVolumeUp />
              </ActionIcon>
            </Tooltip>
            {/* 4. */}
            <CopyButton value={text}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? 'Copied!' : 'Copy to clipboard'} withArrow>
                  <ActionIcon onClick={copy}>
                    {copied ? <MdDone /> : <MdOutlineContentCopy />}
                  </ActionIcon>
                </Tooltip>
              )}
            </CopyButton>
          </Group>
        </Stack>
      </Box>
    </MantineProvider>
  ) : (
    <></>
  );
};

export default Content;
