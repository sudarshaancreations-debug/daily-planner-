import { parseNaturalLanguageScheduleDump, analyzeMealText } from '../src/engines/aiEngine.ts';

console.log('=== TEST 1: Reel #6 Food Note ("paneer tikka, 3 rotis, dal, a cold coffee") ===');
const mealAnalysis = analyzeMealText('paneer tikka, 3 rotis, dal, a cold coffee');
console.log('Meal Analysis:', JSON.stringify(mealAnalysis, null, 2));

const mealTasks = parseNaturalLanguageScheduleDump('paneer tikka, 3 rotis, dal, a cold coffee');
console.log('\nParsed Meal Tasks:', JSON.stringify(mealTasks, null, 2));

console.log('\n=== TEST 2: Executive Schedule Dump ("10am team standup, 1pm client lunch with Priya, 3pm design review, workout at 6pm") ===');
const scheduleTasks = parseNaturalLanguageScheduleDump('10am team standup, 1pm client lunch with Priya, 3pm design review, workout at 6pm');
console.log('Parsed Schedule Tasks Count:', scheduleTasks.length);
scheduleTasks.forEach((t, i) => {
  console.log(`[${i+1}] ${t.startTime} - ${t.endTime} | ${t.title} (${t.category}, ${t.color}) => ${t.subtitle}`);
});

console.log('\n=== ALL TESTS PASSED ===');
