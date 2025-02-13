import { taskMessagePhrases } from '../constants';
import { Task, TaskProbability } from '../models';
import { decodeBase64, decryptRot13, includesAny } from './app.utils';

export function parseTasks(tasks: Task[]) {
  return tasks.map((task) => {
    if (task.encrypted === 1) {
      task.adId = decodeBase64(task.adId);
      task.message = decodeBase64(task.message);
      task.probability = decodeBase64(task.probability) as TaskProbability;
    } else if (task.encrypted === 2) {
      task.adId = decryptRot13(task.adId);
      task.message = decryptRot13(task.message);
      task.probability = decryptRot13(task.probability) as TaskProbability;
    }

    task.message = task.message.replace(/\.$/, '');

    return task;
  });
}

export function isTaskGoodForPeople(task: Task) {
  const isGood = includesAny(task.message, taskMessagePhrases.positive);
  return isGood && !isTaskTrap(task) && !isTaskNeutral(task);
}

export function isTaskBadForState(task: Task) {
  const isBad = includesAny(task.message, taskMessagePhrases.negative);
  return isBad && !isTaskTrap(task) && !isTaskNeutral(task);
}

export function isTaskNeutral(task: Task) {
  const isNeutral = includesAny(task.message, taskMessagePhrases.neutral);
  return isNeutral && !isTaskTrap(task);
}

export function isTaskTrap(task: Task) {
  return includesAny(task.message, taskMessagePhrases.trap);
}
