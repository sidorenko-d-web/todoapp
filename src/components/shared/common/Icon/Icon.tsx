type IconProps = {
  name: string;
  className?: string;
};

export const Icon: React.FC<IconProps> = ({ name, className }: IconProps) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg">
      <use xlinkHref={`/spritemap.svg#${name}`} />
    </svg>
  );
};
