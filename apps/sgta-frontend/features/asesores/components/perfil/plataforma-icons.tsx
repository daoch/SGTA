import {
  Award,
  BookOpen,
  FlaskConical,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Search,
  Twitter,
} from "lucide-react";
import { PlataformaType } from "../../types/perfil/entidades";

interface PlatformIconProps {
  platform: PlataformaType;
  className?: string;
}

export function PlatformIcon({
  platform,
  className = "h-4 w-4",
}: PlatformIconProps) {
  const iconProps = { className };

  switch (platform) {
    case "LinkedIn":
      return (
        <Linkedin {...iconProps} className={`${className} text-blue-600`} />
      );
    case "GitHub":
      return <Github {...iconProps} className={`${className} text-gray-800`} />;
    case "Twitter":
      return (
        <Twitter {...iconProps} className={`${className} text-blue-400`} />
      );
    case "Google Scholar":
      return (
        <GraduationCap
          {...iconProps}
          className={`${className} text-blue-500`}
        />
      );
    case "ResearchGate":
      return (
        <FlaskConical {...iconProps} className={`${className} text-teal-600`} />
      );
    case "ORCID":
      return (
        <div
          className={`${className} bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}
        >
          ID
        </div>
      );
    case "Academia.edu":
      return (
        <BookOpen {...iconProps} className={`${className} text-indigo-600`} />
      );
    case "Scopus":
      return (
        <Search {...iconProps} className={`${className} text-orange-500`} />
      );
    case "Web of Science":
      return <Award {...iconProps} className={`${className} text-red-600`} />;
    case "Otras":
    default:
      return <Globe {...iconProps} className={`${className} text-gray-500`} />;
  }
}

export const PLATAFORMAS_DISPONIBLES: PlataformaType[] = [
  "LinkedIn",
  "GitHub",
  "Twitter",
  "Google Scholar",
  "ResearchGate",
  "ORCID",
  "Academia.edu",
  "Scopus",
  "Web of Science",
  "Otras",
];

export function getPlatformDisplayName(platform: PlataformaType): string {
  switch (platform) {
    case "Google Scholar":
      return "Google Scholar";
    case "ResearchGate":
      return "ResearchGate";
    case "Academia.edu":
      return "Academia.edu";
    case "Web of Science":
      return "Web of Science";
    default:
      return platform;
  }
}
