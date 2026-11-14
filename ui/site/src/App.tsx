import "./internal/landing.css";
import { Button } from "@astryxdesign/core/Button";
import { ClickableCard } from "@astryxdesign/core/ClickableCard";
import { Grid } from "@astryxdesign/core/Grid";
import { Heading } from "@astryxdesign/core/Heading";
import { useAnnounce, useClipboard, useMediaQuery } from "@astryxdesign/core/hooks";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Link } from "@astryxdesign/core/Link";
import { MobileNav } from "@astryxdesign/core/MobileNav";
import { SideNavItem } from "@astryxdesign/core/SideNav";
import { Text } from "@astryxdesign/core/Text";
import { Theme } from "@astryxdesign/core/theme";
import { TopNav, TopNavItem } from "@astryxdesign/core/TopNav";
import { VStack } from "@astryxdesign/core/VStack";
import { useEffect, useState, type SVGProps } from "react";

import { defaultThemeSlug, themes } from "./astryx-themes";
import { BrandMark } from "./internal/brand-mark";
import { brandShaders, stillBrandShaders } from "./internal/brand-shader";
import { landingAssets } from "./internal/landing-assets";
import { LandingGuides, LandingMarks } from "./internal/landing-guides";
import { palette, type ColorMode } from "./themes/trajs/palette";

const repository = "https://github.com/trajs-ai/trajs";
const installCommand = "pnpm i effect @trajs/core";

const changelog = `${repository}/blob/main/packages/core/CHANGELOG.md`;

const navigation = [
  { label: "DOCS", href: `${repository}#readme` },
  { label: "EXAMPLES", href: `${repository}/tree/main/examples` },
  { label: "BLOG", href: `${repository}/discussions` },
  { label: "CHANGELOG", href: changelog },
  { label: "GITHUB", href: repository },
];

const license = `${repository}/blob/main/LICENSE`;

// The release line is copy, so it is updated with the site instead of derived
// from the package; it points at the changelog the navigation links.
const notice = {
  label: "// TRAJS 0.0.0-ALPHA.4 · CHANGELOG",
  href: changelog,
};

// The hero already names the three ideas; the footer names where to read
// about them and where the project lives.
const footerGroups = [
  {
    title: "RESOURCES",
    label: "Resources",
    links: [
      { label: "DOCUMENTATION", href: `${repository}#readme` },
      { label: "EXAMPLES", href: `${repository}/tree/main/examples` },
      { label: "CHANGELOG", href: changelog },
    ],
  },
  {
    title: "COMMUNITY",
    label: "Community",
    links: [
      { label: "GITHUB", href: repository },
      { label: "DISCUSSIONS", href: `${repository}/discussions` },
      { label: "ISSUES", href: `${repository}/issues` },
    ],
  },
] as const;

// Astryx has no sun or moon glyph, so the board's artwork reaches `Icon` as a
// component and takes its size from it.
function SunGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 12 12" fill="none" {...props}>
      <circle cx="6" cy="6" r="2.075" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M6 0.7V1.95M6 10.05V11.3M0.7 6H1.95M10.05 6H11.3M2.26 2.26L3.13 3.13M9.74 2.26L8.87 3.13M2.26 9.74L3.13 8.87M9.74 9.74L8.87 8.87"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="6.9375 6.9375 10.125 10.125" fill="none" {...props}>
      <path
        d="M10.4697 6.93701C9.85399 7.73187 9.4873 8.72972 9.4873 9.81299C9.48741 12.4086 11.5918 14.5132 14.1875 14.5132C15.2709 14.5132 16.2676 14.1447 17.0625 13.5288C16.3678 15.5831 14.4265 17.0629 12.1377 17.063C9.26581 17.063 6.9375 14.7347 6.9375 11.8628C6.9375 9.57437 8.41605 7.63211 10.4697 6.93701Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function App() {
  const [mode, setMode] = useState<ColorMode>(() => {
    try {
      return localStorage.getItem("trajs-color-mode") === "light" ? "light" : "dark";
    } catch {
      return "dark";
    }
  });

  const reducesMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const assets = landingAssets[mode];
  const shader = (reducesMotion ? stillBrandShaders : brandShaders)[mode];
  const [headerVisible, setHeaderVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // The hook owns the copied window, the repeat copy, and the announcement.
  const { copy, isCopied: installCopied } = useClipboard({
    announce: "Install command copied.",
    resetAfterMs: 2500,
  });

  const announce = useAnnounce();

  useEffect(() => {
    const update = () => setHeaderVisible(window.scrollY > 64);
    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, []);

  // The drawer renders outside the header, so hiding the header closes it.
  useEffect(() => {
    if (!headerVisible) setMenuOpen(false);
  }, [headerVisible]);

  useEffect(() => {
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

    if (themeColor) themeColor.content = palette[mode].canvas;

    try {
      localStorage.setItem("trajs-color-mode", mode);
    } catch {
      /* The selected mode still applies when browser storage is unavailable. */
    }
  }, [mode]);

  // The hook stays silent on a failed write, so the fallback is announced
  // instead. The command above is selectable text.
  async function copyInstallCommand() {
    if (await copy(installCommand)) return;

    announce("Copy unavailable. Select the command to copy it manually.");
  }

  return (
    <Theme theme={themes[defaultThemeSlug]} mode={mode}>
      <VStack id="top" className="landing-page">
        <VStack as="main" className="landing-sheet">
          <LandingGuides />
          <Link href={notice.href} color="inherit" type="inherit" className="landing-notice">
            <HStack gap={1.5} vAlign="center">
              <Text type="inherit">{notice.label}</Text>
              <img src={assets.arrowUpRight} alt="" className="landing-ink-asset" />
            </HStack>
          </Link>
          <LandingMarks />
          {/* The frame is the page's and the navigation is TopNav's, so the links
              and the drawer keep the system's semantics and keyboard behavior. */}
          <HStack
            as="header"
            vAlign="center"
            gap={4}
            className={headerVisible ? "landing-header landing-header--visible" : "landing-header"}
            inert={!headerVisible}
            aria-hidden={!headerVisible}
          >
            <TopNav
              className="landing-top-nav"
              label="Main navigation"
              heading={
                <Link href={import.meta.env.BASE_URL} color="inherit" type="inherit">
                  <HStack gap={2} vAlign="center" className="landing-brand">
                    <img src={assets.logoMark} alt="" className="landing-brand-mark" />
                    <Text type="inherit">TRAJS</Text>
                  </HStack>
                </Link>
              }
              endContent={
                <HStack vAlign="center" className="landing-header-end">
                  <HStack vAlign="center" className="landing-nav">
                    {navigation.map(({ label, href }) => (
                      <TopNavItem
                        key={label}
                        label={label}
                        href={href}
                        className={
                          label === "CHANGELOG"
                            ? "landing-nav-link landing-changelog"
                            : "landing-nav-link"
                        }
                      >
                        <HStack gap={1.5} vAlign="center">
                          <Text type="inherit">{label}</Text>
                          {label === "GITHUB" && (
                            <img src={assets.arrow} alt="" className="landing-ink-asset" />
                          )}
                        </HStack>
                      </TopNavItem>
                    ))}
                  </HStack>
                  <IconButton
                    label={mode === "dark" ? "Use light theme" : "Use dark theme"}
                    size="sm"
                    variant="ghost"
                    className="landing-theme-toggle"
                    onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                    icon={
                      mode === "dark" ? (
                        <Icon icon={SunGlyph} size="sm" />
                      ) : (
                        <Icon icon={MoonGlyph} size="sm" />
                      )
                    }
                  />
                  <IconButton
                    label="Open menu"
                    variant="ghost"
                    size="sm"
                    className="landing-menu-button"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(true)}
                    icon={<Icon icon="menu" />}
                  />
                </HStack>
              }
            />
          </HStack>
          <MobileNav
            isOpen={menuOpen}
            onOpenChange={setMenuOpen}
            side="end"
            header={
              <Text type="inherit" className="landing-brand">
                TRAJS
              </Text>
            }
          >
            {navigation.map(({ label, href }) => (
              <SideNavItem
                key={label}
                label={label}
                href={href}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </MobileNav>
          <Grid className="landing-hero">
            <VStack className="landing-headline">
              <Heading level={1} className="landing-heading">
                <Text as="span" display="block" type="inherit" className="landing-headline-line">
                  Record.
                </Text>
                <Text as="span" display="block" type="inherit" className="landing-analysis-line">
                  Analysis.
                </Text>
                <Text as="span" display="block" type="inherit" className="landing-headline-line">
                  Exchange.
                </Text>
              </Heading>
            </VStack>
            <VStack className="landing-art">
              <VStack role="img" aria-label="TRAJS" className="landing-lockup">
                <VStack className="landing-symbol" aria-hidden="true">
                  <BrandMark
                    mask={assets.symbolFill}
                    shader={shader}
                    reducesMotion={reducesMotion}
                  />
                </VStack>
                <img src={assets.wordmark} alt="" className="landing-wordmark" />
              </VStack>
            </VStack>
            <HStack vAlign="center" className="landing-ctas">
              <Button
                label="Get started"
                href={navigation[0].href}
                variant="primary"
                size="lg"
                className="landing-action"
                endContent={<img src={assets.arrowRight} alt="" className="landing-action-icon" />}
              />
              <ClickableCard
                label={`Copy install command: ${installCommand}`}
                onClick={copyInstallCommand}
                variant="transparent"
                padding={0}
                className="landing-command"
              >
                <Text type="code" className="landing-prompt" aria-hidden="true">
                  $
                </Text>
                <Text as="p" type="code" className="landing-command-text">
                  {installCommand}
                </Text>
                {installCopied ? (
                  <Icon icon="check" className="landing-command-icon" />
                ) : (
                  <Icon icon="copy" className="landing-command-icon" />
                )}
              </ClickableCard>
            </HStack>
          </Grid>
        </VStack>
        <VStack as="footer" className="landing-footer">
          <Grid className="landing-footer-index">
            <VStack className="landing-footer-brand">
              <Link href={import.meta.env.BASE_URL} color="inherit" type="inherit">
                <HStack gap={2} vAlign="center" className="landing-brand">
                  <img src={assets.logoMark} alt="" className="landing-brand-mark" />
                  <Text type="inherit">TRAJS</Text>
                </HStack>
              </Link>
              <Text as="p" color="secondary" className="landing-footer-about">
                Record, analyze and exchange agent trajectories.
              </Text>
            </VStack>
            {footerGroups.map((group) => (
              <VStack
                as="nav"
                key={group.title}
                aria-label={group.label}
                className="landing-footer-group"
              >
                <Heading level={2} className="landing-footer-heading">
                  {group.title}
                </Heading>
                <VStack className="landing-footer-links">
                  {group.links.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      color="inherit"
                      type="inherit"
                      className="landing-label landing-footer-link"
                    >
                      <HStack gap={1.5} vAlign="center">
                        <Text type="inherit">{label}</Text>
                        <img src={assets.arrowUpRight} alt="" className="landing-ink-asset" />
                      </HStack>
                    </Link>
                  ))}
                </VStack>
              </VStack>
            ))}
          </Grid>
          <HStack vAlign="center" hAlign="between" wrap="wrap" className="landing-footer-legal">
            <HStack vAlign="center" wrap="wrap" className="landing-footer-meta">
              <Text type="code" className="landing-legal-label landing-footer-legal-text">
                © {new Date().getFullYear()} TRAJS
              </Text>
              <Link
                href={license}
                color="inherit"
                type="inherit"
                className="landing-footer-legal-link"
              >
                <HStack gap={1.5} vAlign="center">
                  <Text type="inherit" className="landing-legal-label">
                    MIT LICENSE
                  </Text>
                  <img src={assets.arrowUpRight} alt="" className="landing-ink-asset" />
                </HStack>
              </Link>
            </HStack>
            <Link href="#top" color="inherit" type="inherit" className="landing-footer-legal-link">
              <HStack gap={1.5} vAlign="center">
                <Text type="inherit" className="landing-legal-label">
                  BACK TO TOP
                </Text>
                <Icon icon="arrowUp" size="xsm" />
              </HStack>
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </Theme>
  );
}
