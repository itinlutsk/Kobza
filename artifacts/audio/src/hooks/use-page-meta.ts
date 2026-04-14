import { useEffect } from "react";

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    return () => {
      metaDesc!.content =
        "Волинська аудіо-компанія — професійна інсталяція звукового, світлового та конференційного AV-обладнання в Луцьку та на Волині.";
    };
  }, [title, description]);
}
