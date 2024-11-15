import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophoneAlt,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import {
  faLinkedinIn,
  faInstagram,
  faYoutube,
  faXTwitter,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import { ExternalLink } from "lucide-react";

export function Header() {
  return (
    <>
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-2 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <a
                href="https://elemarjr.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/logo-elemar-jr.png"
                  alt="Elemar JR Logo"
                  width={130}
                />
              </a>

              <div>
                <div className="hidden md:flex items-center ml-[20px]">
                  <a
                    href="https://open.spotify.com/show/0ZaI3s6iERIUw081gQLIvw?si=76dfe34da73041da"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EF6823] hover:text-[#d55a1d] transition-colors"
                    title="Podcast"
                  >
                    <div className="w-[36px] h-[36px] flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faMicrophoneAlt}
                        className="w-[18px] h-[18px]"
                      />
                    </div>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/elemarjr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EF6823] hover:text-[#d55a1d] transition-colors"
                    title="LinkedIn"
                  >
                    <div className="w-[36px] h-[36px] flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faLinkedinIn}
                        className="w-[18px] h-[18px]"
                      />
                    </div>
                  </a>
                  <a
                    href="https://www.instagram.com/elemarjr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EF6823] hover:text-[#d55a1d] transition-colors"
                    title="Instagram"
                  >
                    <div className="w-[36px] h-[36px] flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faInstagram}
                        className="w-[18px] h-[18px]"
                      />
                    </div>
                  </a>
                  <a
                    href="https://www.youtube.com/@elemarjr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EF6823] hover:text-[#d55a1d] transition-colors"
                    title="YouTube"
                  >
                    <div className="w-[36px] h-[36px] flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faYoutube}
                        className="w-[18px] h-[18px]"
                      />
                    </div>
                  </a>
                  <a
                    href="https://twitter.com/elemarjr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EF6823] hover:text-[#d55a1d] transition-colors"
                    title="Twitter/X"
                  >
                    <div className="w-[36px] h-[36px] flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faXTwitter}
                        className="w-[18px] h-[18px]"
                      />
                    </div>
                  </a>
                  <a
                    href="https://www.linkedin.com/newsletters/tech-insights-7211418696383119360/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EF6823] hover:text-[#d55a1d] transition-colors"
                    title="Newsletter"
                  >
                    <div className="w-[36px] h-[36px] flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faNewspaper}
                        className="w-[18px] h-[18px]"
                      />
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ElemarJR/color-reduction-with-pca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EF6823] hover:text-[#d55a1d] transition-colors"
                title="GitHub"
              >
                <div className="w-[36px] h-[36px] flex items-center justify-center">
                  <FontAwesomeIcon icon={faGithub} className="w-[18px] h-[18px]" />
                </div>
              </a>
              <a
                href="https://elemarjr.com/trabalhe-comigo/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex border-2 border-[#EF6823] text-[#EF6823] px-4 h-[28px] items-center justify-center rounded text-[12px] uppercase font-medium hover:bg-[#EF6823] hover:text-white transition-colors"
              >
                Work With Me
              </a>
              <a
                href="https://elemarjr.com/seja-meu-cliente/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#EF6823] text-white px-4 h-[28px] flex items-center justify-center rounded text-[12px] uppercase font-medium hover:bg-[#d55a1d] transition-colors"
              >
                Become a Client
              </a>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="max-w-6xl mx-auto py-3 px-1">
          <div className="flex flex-col gap-1">
            <p className="text-gray-600 leading-relaxed text-xs">
              This example was developed by Elemar JR for an Algorithms and Data
              Structures masterclass, focusing on dimensionality reduction using
              Principal Component Analysis (PCA). The complete class recording,
              including in-depth explanations and implementation details, is
              available exclusively for{" "}
              <a
                href="https://elemarjr.com/ofertas/clube-de-estudos/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline inline-flex items-center text-gray-700"
              >
                Study Club members
                <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
