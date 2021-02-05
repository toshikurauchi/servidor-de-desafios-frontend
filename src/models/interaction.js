import _ from "lodash";

export function groupBySlug(interactions) {
  return _.fromPairs(
    interactions.map((interaction) => [interaction.challenge.slug, interaction])
  );
}
