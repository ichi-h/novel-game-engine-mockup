import { clearAllChannels } from '@/mixer/clear-all-channels';
import type { NovelModel } from '@/model';

export type SwitchScenarioMessage = {
  type: 'SwitchScenario';
  scenario: string;
  index?: number;
  resetState?: boolean;
};

export const switchScenario = ({
  scenario,
  index,
  resetState,
}: Omit<SwitchScenarioMessage, 'type'>): SwitchScenarioMessage => ({
  type: 'SwitchScenario',
  scenario,
  ...(index !== undefined ? { index } : {}),
  ...(resetState !== undefined ? { resetState } : {}),
});

export const handleSwitchScenario = (
  model: NovelModel,
  msg: SwitchScenarioMessage,
): NovelModel => {
  const newIndex = msg.index ?? 0;

  let newModel: NovelModel = {
    ...model,
    status: { value: 'RequestingNext' },
    currentScenario: msg.scenario,
    index: newIndex,
  };

  if (msg.resetState) {
    newModel = {
      ...newModel,
      mixer: {
        value: clearAllChannels(newModel.mixer.value),
        isApplying: false,
      },
      ui: [],
      animationTickets: [],
    };
  }

  return newModel;
};
