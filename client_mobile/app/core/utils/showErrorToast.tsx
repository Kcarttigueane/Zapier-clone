import { Toast, ToastTitle, VStack } from '@gluestack-ui/themed';
import React from 'react';

const showErrorToast = (error: any, toast: any) => {
  console.log(error);
  toast.show({
    placement: 'top',
    render: ({ id }) => (
      <Toast nativeID={'toast-' + id} action="error" variant="accent">
        <VStack space="sm">
          <ToastTitle>{error.response.data.detail}</ToastTitle>
        </VStack>
      </Toast>
    ),
  });
};

export default showErrorToast;
