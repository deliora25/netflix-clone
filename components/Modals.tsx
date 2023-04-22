import { XCircleIcon } from "@heroicons/react/24/outline";
import { modalState, movieState } from "../atoms/modalAtom";
import Modal from "@mui/material/Modal";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { Element, Genre } from "@/typings";
import ReactPlayer from "react-player/lazy";

function Modals() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState("");
  const [genres, setGenres] = useState<Genre[]>();
  const [muted, setMuted] = useState(true);

  //fetch videos using useEffect
  useEffect(() => {
    if (!movie) return;

    async function fetchMovie() {
      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      )
        .then((response) => response.json())
        .catch((err) => console.log(err.message));

      //check if data has videos, find the index and set element.type to trailer
      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (element: Element) => element.type === "Trailer"
        );

        //to render a youtube player
        setTrailer(data.videos?.results[index]?.key);
      }

      if (data?.genres) {
        setGenres(data.genres);
      }
    }
    //invoke the function inside useEffect
    fetchMovie();
  }, [movie]);

  const handleClose = () => {
    setShowModal(false);
  };

  console.log(trailer);

  return (
    <Modal open={showModal} onClose={handleClose}>
      <>
        <button className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]">
          <XCircleIcon className="h-6 w-6" onClick={handleClose} />
        </button>
        <div className="relative pt-[56.25%] ">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${trailer}`}
            width="100%"
            height="100%"
            style={{ position: "absolute", top: "0", left: "0" }}
            muted={muted}
            playing
          />
          <div>
            <div></div>
          </div>
        </div>
      </>
    </Modal>
  );
}

export default Modals;
