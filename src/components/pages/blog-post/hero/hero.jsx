import PropTypes from 'prop-types';

import Link from 'components/shared/link';
import LINKS from 'constants/links';

const Hero = ({ title, description, date, category, className = null }) => (
  <div className={className}>
    <div className="flex items-center">
      <Link
        className="mr-3 rounded-[40px] bg-green/10 px-3.5 py-2 text-[12px] font-semibold uppercase leading-none tracking-[0.02em] text-green"
        to={`${LINKS.blog}${category.slug}`}
      >
        {category.name}
      </Link>
      <time
        className="text-[13px] uppercase leading-none tracking-[0.02em] text-gray-new-80"
        dateTime={date}
      >
        {date}
      </time>
    </div>
    <h1 className="t-5xl mt-3 font-medium leading-dense tracking-tighter">{title}</h1>
    <p className="t-2xl mt-3 leading-snug text-gray-new-70 md:!text-lg">{description}</p>
  </div>
);

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,

  date: PropTypes.string.isRequired,
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
};

export default Hero;
