const Track = ({
  name,
  artists,
  album,
  id,
}: {
  name: string;
  artists: string;
  album: string;
  id: string;
}) => {
  return (
    <div>
      <ul key={id}>
        <li>{name}</li>
        <li>{artists}</li>
        <li>{album}</li>
      </ul>
    </div>
  );
};

export default Track;

/* 
I realize there is better way to correctly type these props,
however I am too unfamiliar with typescipt to figure it out 
*/
