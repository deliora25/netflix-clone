import { CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { SpeakerXMarkIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { modalState, movieState } from "../atoms/modalAtom";
import Modal from "@mui/material/Modal";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { Element, Genre } from "@/typings";
import ReactPlayer from "react-player/lazy";
import { FaPlay } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { FiThumbsUp } from "react-icons/fi";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import useAuth from "@/hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";

function Modals() {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [movie, setMovie] = useRecoilState(movieState);
  const [trailer, setTrailer] = useState("");
  const [genres, setGenres] = useState<Genre[]>();
  const [muted, setMuted] = useState(true);
  const { user } = useAuth();
  const [addedToList, setAddedToList] = useState(false);

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

  //handles adding or removing movie from the list
  const handleList = async () => {
    if (addedToList) {
      await deleteDoc(
        //provide the db instance and goes into the collection of customers, provide the user uid and creates "myList" and tap onto the movie id and convert to string
        doc(db, "customers", user!.uid, "myList", movie?.id.toString()!)
      );

      toast(
        `${movie?.title || movie?.original_name} has been removed from My List`,
        {
          duration: 8000,
        }
      );
    } else {
      await setDoc(
        //ID
        doc(db, "customers", user!.uid, "myList", movie?.id.toString()!),
        //movie that will be added to collection
        { ...movie }
      );
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <Modal
      open={showModal}
      onClose={handleClose}
      className="fixex !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
    >
      <>
        <Toaster position="bottom-center" />
        <button
          className="modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
          onClick={handleClose}
        >
          <XCircleIcon className="h-6 w-6" />
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
          <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
            <div className="flex space-x-2">
              <button className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]">
                <FaPlay className="h-7 w-7 text-black" />
                Play
              </button>
              <button className="modalButton" onClick={handleList}>
                {addedToList ? (
                  <CheckIcon className="h-7 w-7" />
                ) : (
                  <AiOutlinePlus className="h-7 w-7" />
                )}
              </button>
              <button className="modalButton">
                <FiThumbsUp className="h-7 w-7" />
              </button>
              <div>
                <button
                  className="modalButton"
                  onClick={() => setMuted(!muted)}
                >
                  {muted ? (
                    <SpeakerXMarkIcon className="h-6 w-6" />
                  ) : (
                    <SpeakerWaveIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8 ">
          <div className="space-y-6 text-lg">
            <div className="flex items-center space-x-2 text-sm">
              <p className="font-semibold text-green-400 ">
                {movie!.vote_average * 10}% Match
              </p>
              <p className="font-light ">
                {movie?.release_date || movie?.first_air_date}
              </p>
              <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                HD
              </div>
            </div>
            <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
              <p className="w-5/6 ">{movie?.overview}</p>
              <div className="flex flex-col space-y-3 text-sm">
                <div>
                  <span className="text-[gray]">Genres: </span>
                  {genres?.map((genre) => genre.name).join(", ")}
                </div>
                <div>
                  <span className="text-[gray] ">Original language: </span>
                  {movie?.original_language}
                </div>
                <div>
                  <span className="text-[gray]">Total view: </span>
                  {movie?.vote_count}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
}

export default Modals;
