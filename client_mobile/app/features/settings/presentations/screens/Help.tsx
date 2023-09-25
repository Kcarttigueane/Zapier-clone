import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';
import { Adapt, Button, Form, Select, Sheet, Spinner, TextArea, YStack } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

const items = [
  { name: 'settings.settingScreen.help.bug' },
  { name: 'settings.settingScreen.help.issue' },
  { name: 'settings.settingScreen.help.feature' },
  { name: 'settings.settingScreen.help.question' },
  { name: 'settings.settingScreen.help.other' },
];

const Help = () => {
  const { t } = useTranslation();
  const [val, setVal] = useState(items[4].name.toLowerCase());
  const [status, setStatus] = useState<'off' | 'submitting' | 'submitted'>('off');

  return (
    <Form minWidth={300} onSubmit={() => setStatus('submitting')} gap={16} padding="$8">
      <Select id="Bug" value={t(val)} onValueChange={setVal} disablePreventBodyScroll>
        <Select.Trigger width={320} iconAfter={ChevronDown}>
          <Select.Value placeholder="Something" />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet
            modal
            dismissOnSnapToBottom
            animationConfig={{
              type: 'spring',
              damping: 20,
              mass: 1.2,
              stiffness: 250,
            }}>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$6">
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$background', '$backgroundTransparent']}
              borderRadius="$4"
            />
          </Select.ScrollUpButton>

          <Select.Viewport
            // to do animations:
            animation="quick"
            animateOnly={['transform', 'opacity']}
            enterStyle={{ o: 0, y: -10 }}
            exitStyle={{ o: 0, y: 10 }}
            minWidth={200}>
            <Select.Group>
              {useMemo(
                () =>
                  items.map((item, i) => {
                    return (
                      <Select.Item index={i} key={item.name} value={item.name.toLowerCase()}>
                        <Select.ItemText>{t(item.name)}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    );
                  }),
                [items],
              )}
            </Select.Group>
          </Select.Viewport>

          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3">
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$backgroundTransparent', '$background']}
              borderRadius="$4"
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
      <Text
        style={{
          marginTop: 16,
        }}>
        Message
      </Text>
      <TextArea placeholder={t('settings.settingScreen.help.textAreaPlaceholder')} width={320} />
      <Form.Trigger asChild disabled={status !== 'off'}>
        <Button icon={status === 'submitting' ? () => <Spinner /> : undefined}>Submit</Button>
      </Form.Trigger>
    </Form>
  );
};

export default Help;
