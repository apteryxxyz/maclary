import { Blist } from './Blist';
import { BotListMe } from './BotListMe';
import { BotsOnDiscord } from './BotsOnDiscord';
import { DiscordBotList } from './DiscordBotList';
import { DiscordBotListEU } from './DiscordBotListEU';
import { DiscordBots } from './DiscordBots';
import { DiscordExtremeList } from './DiscordExtremeList';
import { DiscordLabs } from './DiscordLabs';
import { DiscordList } from './DiscordList';
import { DiscordServices } from './DiscordServices';
import { DiscordsCom } from './DiscordsCom';
import { Disforge } from './Disforge';
import { InfinityBotList } from './InfinityBotList';
import { MotionBotList } from './MotionBotList';
import { TopCord } from './TopCord';
import { TopGG } from './TopGG';
import { UniverseList } from './UniverseList';
import { VoidBots } from './VoidBots';
import { WonderBots } from './WonderBotList';
import { YABL } from './YABL';

export const Lists = {
    Blist,
    BotListMe,
    BotsOnDiscord,
    DiscordBotList,
    DiscordBotListEU,
    DiscordBots,
    DiscordExtremeList,
    DiscordLabs,
    DiscordList,
    DiscordsCom,
    DiscordServices,
    Disforge,
    InfinityBotList,
    MotionBotList,
    TopCord,
    TopGG,
    UniverseList,
    VoidBots,
    WonderBots,
    YABL,
} as const;

export type KeyOfLists = Lowercase<keyof typeof Lists>;
