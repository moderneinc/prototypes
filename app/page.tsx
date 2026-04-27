import { SideNav } from "@/components/SideNav";
import { Intro } from "@/app/sections/Intro";
import { Approach } from "@/app/sections/Approach";
import { TokensIntro } from "@/app/sections/Tokens";
import { TokensColor } from "@/app/sections/TokensColor";
import { TokensTypography } from "@/app/sections/TokensTypography";
import { TokensSpacing } from "@/app/sections/TokensSpacing";
import { TokensGlyphs } from "@/app/sections/TokensGlyphs";
import { TokensBanners } from "@/app/sections/TokensBanners";
import { TokensLinks } from "@/app/sections/TokensLinks";
import { Patterns } from "@/app/sections/Patterns";
import { Voice } from "@/app/sections/Voice";
import { Examples } from "@/app/sections/Examples";

export default function HomePage() {
  return (
    <>
      <SideNav homeBase />
      <main className="md:ml-56">
        <div className="mx-auto max-w-3xl px-6 py-6 md:py-10">
          <Intro />
          <Approach />
          <TokensIntro />
          <TokensColor />
          <TokensTypography />
          <TokensSpacing />
          <TokensGlyphs />
          <TokensBanners />
          <TokensLinks />
          <Patterns />
          <Voice />
          <Examples />
        </div>
      </main>
    </>
  );
}
