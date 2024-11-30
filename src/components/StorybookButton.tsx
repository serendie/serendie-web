import { Button } from "@serendie/ui";
import { SerendieSymbol } from "@serendie/symbols";

interface StorybookButtonProps {
  storyPath: string;
}

const URL = "https://storybook.serendie.design/";

export const StorybookButton: React.FC<StorybookButtonProps> = ({
  storyPath,
}) => {
  const href = `${URL}?path=${storyPath}`;
  return (
    <Button
      // TODO: ButtonLinkとかにして、<a>でリンクするようにしたい
      onClick={() => window.open(href, "_blank")}
      size={"small"}
      styleType={"outlined"}
      rightIcon={<SerendieSymbol name={"arrow_blank"} />}
    >
      Storybook
    </Button>
  );
};
