'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { actionFunction } from '@/utils/types';

const initialState = {
  message: '',
};

function FormContainer({
  action,
  children,
}: {
  action: actionFunction;
  // asyncFnで、resolveするとmessageをリターンするFnタイプ(actionによりstateが更新される)
  children: React.ReactNode;
}) {
  const [state, formAction] = useFormState(action, initialState);
  // actionがリターンした値が最新stateになる。全てのserver-actionは、messageを返すように規定してあり、これがstateになる
  // actionは引数にprevStateとformDataを持っている。
  // actionが実行されるとprevStateが変わり、最新の状態を反映させたのがformActionに入るのだろう。
  const { toast } = useToast();
  useEffect(() => {
    if (state.message) {
      toast({ description: state.message });
    }
  }, [state]);
  // initialStateのmessageは''だから、初回レンダー時はtoastは実行されない
  return <form action={formAction}>{children}</form>;
}
export default FormContainer;
