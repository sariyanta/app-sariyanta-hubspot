import {
  ModuleFields,
  TextField,
  RichTextField,
  ImageField,
} from '@hubspot/cms-components/fields';

import { Button } from '@/components/ui/button';

export function Component() {
  return <Button variant={'link'}>Hello Joep and Zoe</Button>;
}

const richTextFieldDefaultValue = `
  <div>
    <div>
      <span>
        Deploy to your theme by running <pre>npm run deploy</pre> from the root directory
      </span>
      </div>
  </div>
`;

export const fields = (
  <ModuleFields>
    <ImageField name="logo" label="Logo" resizable={true} />
    <TextField
      name="headline"
      label="Headline"
      default="Getting Started with CMS React"
    />
    <RichTextField
      name="gettingStarted"
      label="Getting Started"
      default={richTextFieldDefaultValue}
    />
  </ModuleFields>
);

export const meta = {
  label: 'Getting Started with CMS React',
};
