export const Hero = ({
  title = "Lemberg International Airport",
  subtitle = "Your way to explore",
  className,
}: {
  title?: string;
  subtitle?: string;
  className: string;
}) => {
  return (
    <section className={`bg-transparent w-full py-20 mb-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white sm:text-md">{title}</h1>
          <p className="my-4 text-xl sm:text-md text-white">{subtitle}</p>
        </div>
      </div>
    </section>
  );
};
