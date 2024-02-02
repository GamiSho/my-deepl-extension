import { ReactElement, useEffect, useState } from 'react';
import { MantineProvider, Container, Select } from '@mantine/core';
import { getBucket } from '@extend-chrome/storage';
import '@mantine/core/styles.css';

type MyBucket = {
  targetLang: string;
};

const bucket = getBucket<MyBucket>('myBucket', 'sync');

const Popup = (): ReactElement => {
  document.body.style.width = '20rem';
  document.body.style.height = '20rem';

  const [lang, setLang] = useState<string>('EN');

  useEffect(() => {
    bucket.get('targetLang').then((value) => {
      setLang(value.targetLang);
    });
  }, []);

  const changeLang = (targetLang: string | null) => {
    if (targetLang !== null) {
      bucket.set({ targetLang });
      setLang(targetLang);
    }
  };

  return (
    <MantineProvider>
      <Container p="xl">
        <Select
          label="Select language"
          value={lang}
          onChange={(value) => changeLang(value)}
          name="targetLang"
          data={[
            { value: 'EN', label: 'English' },
            { value: 'JA', label: 'Japanese' },
            { value: 'ZH', label: 'Chinese' },
            { value: 'KO', label: 'Korean' },
          ]}
        />
      </Container>
    </MantineProvider>
  );
};

export default Popup;
