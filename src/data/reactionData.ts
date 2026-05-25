import { STAR_DOMAIN, PLANET_DOMAIN, ReactionDomain } from './reactionDataCosmos';
import { PLANT_DOMAIN, CELL_DOMAIN, TISSUE_DOMAIN } from './reactionDataBio1';
import { ORGAN_DOMAIN, ANIMAL_DOMAIN } from './reactionDataBio2';

export * from './reactionDataCosmos';

export const REACTION_DOMAINS: ReactionDomain[] = [
  STAR_DOMAIN,
  PLANT_DOMAIN,
  CELL_DOMAIN,
  TISSUE_DOMAIN,
  PLANET_DOMAIN,
  ORGAN_DOMAIN,
  ANIMAL_DOMAIN
];

/**
 * Returns a list of all reactions across all domains
 */
export const getAllReactions = () => {
  return REACTION_DOMAINS.flatMap(d => d.reactions);
};
