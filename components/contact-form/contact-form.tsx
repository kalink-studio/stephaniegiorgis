'use client';

import { Button, Cluster, Field, Stack, Text } from '@kalink-ui/seedly-react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import {
  ComponentPropsWithoutRef,
  useCallback,
  useState,
  useTransition,
} from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { sendForm } from '@/components/contact-form/send-form';
import { MessageInputs } from '@/components/contact-form/types';

import {
  actions,
  contactForm,
  control as controlClassName,
  messageControl,
} from './contact-form.css';

const REQUIRED_RULE = { required: 'Ce champ est requis' } as const;

export const ContactForm = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'form'>) => {
  const { control, handleSubmit, reset } = useForm<MessageInputs>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<MessageInputs> = useCallback(
    (formData) => {
      startTransition(async () => {
        const { data, error } = await sendForm(formData);

        if (error || !data) {
          throw new Error(error?.message || 'An unexpected error occurred');
        }

        setSent(true);
        reset();
      });
    },
    [setSent, reset, startTransition],
  );

  return (
    <form
      {...props}
      className={clsx(contactForm, className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={6} align="stretch">
        <Controller
          name="name"
          control={control}
          rules={REQUIRED_RULE}
          render={({
            field,
            fieldState: { invalid, isTouched, isDirty, error },
          }) => (
            <Field.Root
              name={field.name}
              invalid={invalid}
              touched={isTouched}
              dirty={isDirty}
            >
              <Field.Label>Votre nom</Field.Label>
              <Field.Control
                className={controlClassName}
                ref={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
              />
              <Field.Error match={!!error}>{error?.message}</Field.Error>
            </Field.Root>
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={REQUIRED_RULE}
          render={({
            field,
            fieldState: { invalid, isTouched, isDirty, error },
          }) => (
            <Field.Root
              name={field.name}
              invalid={invalid}
              touched={isTouched}
              dirty={isDirty}
            >
              <Field.Label>Votre email</Field.Label>
              <Field.Control
                className={controlClassName}
                ref={field.ref}
                type="email"
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
              />
              <Field.Error match={!!error}>{error?.message}</Field.Error>
            </Field.Root>
          )}
        />

        <Controller
          name="subject"
          control={control}
          rules={REQUIRED_RULE}
          render={({
            field,
            fieldState: { invalid, isTouched, isDirty, error },
          }) => (
            <Field.Root
              name={field.name}
              invalid={invalid}
              touched={isTouched}
              dirty={isDirty}
            >
              <Field.Label>Sujet du message</Field.Label>
              <Field.Control
                className={controlClassName}
                ref={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
              />
              <Field.Error match={!!error}>{error?.message}</Field.Error>
            </Field.Root>
          )}
        />

        <Controller
          name="message"
          control={control}
          rules={REQUIRED_RULE}
          render={({
            field,
            fieldState: { invalid, isTouched, isDirty, error },
          }) => (
            <Field.Root
              name={field.name}
              invalid={invalid}
              touched={isTouched}
              dirty={isDirty}
            >
              <Field.Label>Message</Field.Label>
              <Field.Control
                className={messageControl}
                ref={field.ref}
                render={<textarea />}
                value={field.value}
                onBlur={field.onBlur}
                onValueChange={field.onChange}
              />
              <Field.Error match={!!error}>{error?.message}</Field.Error>
            </Field.Root>
          )}
        />

        <Cluster spacing={6} className={actions}>
          <Button
            shape="small"
            variant="solid"
            tone="neutral"
            type="submit"
            disabled={isPending}
          >
            {'Envoyer'}
          </Button>
          {sent && (
            <Cluster spacing={3}>
              <Check size={24} />
              <Text>{'Message envoyé'}</Text>
            </Cluster>
          )}
        </Cluster>
      </Stack>
    </form>
  );
};
