import { AstBuilder, Parser, GherkinClassicTokenMatcher, compile } from '@cucumber/gherkin';
import * as messages from '@cucumber/messages';
const newId = messages.IdGenerator.incrementing();
const builder = new AstBuilder(newId);
const matcher = new GherkinClassicTokenMatcher();
const parser = new Parser(builder, matcher);
const doc = parser.parse('Feature: test\nScenario Outline: s1\nGiven <v>\nExamples:\n|v|\n|1|\n|2|');
const pickles = compile(doc, 'test.feature', newId);
console.log(pickles.length, pickles[0].name, pickles[0].steps[0].text);
